import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import {
  getExhibitionById,
  getExhibitionBySlug,
  updateExhibition,
  deleteExhibition,
  getArtistById,
  getAllArtworks,
  incrementExhibitionViews,
} from '@/lib/db';

async function getAuthArtist(req: Request) {
  const cookieStore = await cookies();
  const token =
    cookieStore.get('kala_session')?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check by ID or slug
    let exhibition = getExhibitionById(id) || getExhibitionBySlug(id);

    if (!exhibition) {
      return NextResponse.json({ error: 'Exhibition not found' }, { status: 404 });
    }

    const payload = await getAuthArtist(req);
    const isOwner = payload && payload.id === exhibition.artistId;

    if (!exhibition.published || exhibition.visibility !== 'public') {
      if (!isOwner) {
        return NextResponse.json({ error: 'This exhibition is private or unlisted' }, { status: 403 });
      }
    }

    // Increment views count on public visits
    if (!isOwner) {
      incrementExhibitionViews(exhibition.id);
    }

    const artist = getArtistById(exhibition.artistId);
    const allWorks = getAllArtworks();

    // Map artworks with custom descriptions
    const populatedArtworks = exhibition.artworks
      .map((item) => {
        const fullWork = allWorks.find((w) => w.id === item.artworkId);
        if (!fullWork) return null;
        return {
          ...fullWork,
          displayOrder: item.displayOrder,
          customDescription: item.customDescription || fullWork.description,
        };
      })
      .filter(Boolean)
      .sort((a, b) => ((a?.displayOrder || 0) - (b?.displayOrder || 0)));

    const safeArtist = artist ? { ...artist, passwordHash: undefined } : null;

    return NextResponse.json({
      success: true,
      exhibition,
      artist: safeArtist,
      artworks: populatedArtworks,
      isOwner: Boolean(isOwner),
    });
  } catch (err: any) {
    console.error('Fetch exhibition by id/slug error:', err);
    return NextResponse.json({ error: 'Failed to fetch exhibition' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getAuthArtist(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = updateExhibition(id, payload.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Exhibition not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, exhibition: updated });
  } catch (err: any) {
    console.error('Update exhibition error:', err);
    return NextResponse.json({ error: 'Failed to update exhibition' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getAuthArtist(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const success = deleteExhibition(id, payload.id);
    if (!success) {
      return NextResponse.json({ error: 'Exhibition not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Exhibition deleted' });
  } catch (err: any) {
    console.error('Delete exhibition error:', err);
    return NextResponse.json({ error: 'Failed to delete exhibition' }, { status: 500 });
  }
}
