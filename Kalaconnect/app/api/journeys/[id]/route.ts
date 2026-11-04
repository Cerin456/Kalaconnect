import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import {
  getJourneyById,
  updateJourney,
  deleteJourney,
  getArtistById,
  getAllArtworks,
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
    const journey = getJourneyById(id);

    if (!journey) {
      return NextResponse.json({ error: 'Creative journey not found' }, { status: 404 });
    }

    const payload = await getAuthArtist(req);
    const isOwner = payload && payload.id === journey.artistId;

    // Enforce privacy: only owner can view unpublished/private journey
    if (!journey.published || journey.visibility !== 'public') {
      if (!isOwner) {
        return NextResponse.json({ error: 'This creative journey is private' }, { status: 403 });
      }
    }

    const artist = getArtistById(journey.artistId);
    const allWorks = getAllArtworks();
    const artwork = allWorks.find((w) => w.id === journey.artworkId);

    const safeArtist = artist ? { ...artist, passwordHash: undefined } : null;

    return NextResponse.json({
      success: true,
      journey,
      artist: safeArtist,
      artwork,
      isOwner: Boolean(isOwner),
    });
  } catch (err: any) {
    console.error('Fetch journey by id error:', err);
    return NextResponse.json({ error: 'Failed to fetch journey' }, { status: 500 });
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

    const updated = updateJourney(id, payload.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Journey not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, journey: updated });
  } catch (err: any) {
    console.error('Update journey error:', err);
    return NextResponse.json({ error: 'Failed to update journey' }, { status: 500 });
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
    const success = deleteJourney(id, payload.id);
    if (!success) {
      return NextResponse.json({ error: 'Journey not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Journey successfully deleted' });
  } catch (err: any) {
    console.error('Delete journey error:', err);
    return NextResponse.json({ error: 'Failed to delete journey' }, { status: 500 });
  }
}
