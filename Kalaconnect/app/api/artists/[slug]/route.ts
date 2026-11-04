import { NextResponse } from 'next/server';
import { getArtistBySlug, getArtworksByArtistId, updateArtist, getJourneysByArtistId } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const artist = getArtistBySlug(slug);

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Increment views count
    updateArtist(artist.id, { viewsCount: (artist.viewsCount || 0) + 1 });

    const artworks = getArtworksByArtistId(artist.id);
    const allJourneys = getJourneysByArtistId(artist.id);
    const publishedJourneys = allJourneys.filter((j) => j.published && j.visibility === 'public');

    const { passwordHash, ...safeArtist } = artist;

    return NextResponse.json({
      success: true,
      artist: safeArtist,
      artworks,
      journeys: publishedJourneys,
    });
  } catch (err) {
    console.error('Artist detail error:', err);
    return NextResponse.json({ error: 'Failed to fetch artist' }, { status: 500 });
  }
}
