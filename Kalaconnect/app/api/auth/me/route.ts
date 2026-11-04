import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getArtistById, getArtworksByArtistId, getEnquiriesByArtistId } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('kala_session')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ authenticated: false, error: 'Not authenticated' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false, error: 'Invalid session' }, { status: 401 });
    }

    const artist = getArtistById(payload.id);
    if (!artist) {
      return NextResponse.json({ authenticated: false, error: 'Artist not found' }, { status: 404 });
    }

    const artworks = getArtworksByArtistId(artist.id);
    const enquiries = getEnquiriesByArtistId(artist.id);

    const { passwordHash, ...safeArtist } = artist;

    return NextResponse.json({
      authenticated: true,
      artist: safeArtist,
      artworks,
      enquiries,
    });
  } catch (err) {
    console.error('Session error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
