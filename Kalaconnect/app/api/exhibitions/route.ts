import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import {
  getExhibitionsByArtistId,
  getAllPublishedExhibitions,
  createExhibition,
  getArtworksByArtistId,
  getAllArtists,
} from '@/lib/db';

async function getAuthArtist(req: Request) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('kala_session')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublicOnly = searchParams.get('public') === 'true';

    if (isPublicOnly) {
      const exhibitions = getAllPublishedExhibitions();
      const artists = getAllArtists();
      const populated = exhibitions.map((exh) => {
        const art = artists.find((a) => a.id === exh.artistId);
        return {
          ...exh,
          artistName: art ? `${art.firstName} ${art.lastName}` : 'Master Artisan',
          artistCraft: art?.craft,
          artistAvatar: art?.avatarUrl,
          artistSlug: art?.slug,
        };
      });
      return NextResponse.json({ success: true, exhibitions: populated });
    }

    const payload = await getAuthArtist(req);
    if (!payload) {
      // Fallback to public exhibitions if not authenticated
      const exhibitions = getAllPublishedExhibitions();
      const artists = getAllArtists();
      const populated = exhibitions.map((exh) => {
        const art = artists.find((a) => a.id === exh.artistId);
        return {
          ...exh,
          artistName: art ? `${art.firstName} ${art.lastName}` : 'Master Artisan',
          artistCraft: art?.craft,
          artistAvatar: art?.avatarUrl,
          artistSlug: art?.slug,
        };
      });
      return NextResponse.json({ success: true, exhibitions: populated, isPublic: true });
    }

    const exhibitions = getExhibitionsByArtistId(payload.id);
    const artworks = getArtworksByArtistId(payload.id);

    return NextResponse.json({ success: true, exhibitions, artworks });
  } catch (err: any) {
    console.error('Fetch exhibitions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getAuthArtist(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      theme = 'Traditional Indian Art',
      category = 'Heritage Craft',
      coverImage,
      startDate = new Date().toISOString().split('T')[0],
      endDate,
      visibility = 'public',
      published = true,
      artworks = [],
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Exhibition title and description are required' }, { status: 400 });
    }

    // Generate clean slug
    const cleanSlug = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newExhibition = createExhibition({
      artistId: payload.id,
      slug: cleanSlug,
      title,
      subtitle: subtitle || '',
      description,
      theme,
      category,
      coverImage: coverImage || '/images/hero_collage.png',
      startDate,
      endDate,
      visibility,
      published,
      artworks: artworks.map((a: any, idx: number) => ({
        artworkId: a.artworkId || a.id,
        displayOrder: a.displayOrder !== undefined ? a.displayOrder : idx + 1,
        customDescription: a.customDescription || '',
      })),
    });

    return NextResponse.json({ success: true, exhibition: newExhibition });
  } catch (err: any) {
    console.error('Create exhibition error:', err);
    return NextResponse.json({ error: 'Failed to create exhibition' }, { status: 500 });
  }
}
