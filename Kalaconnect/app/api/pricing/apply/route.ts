import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { updateArtworkPrice } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('kala_session')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { artworkId, price } = await req.json();
    if (!artworkId || !price) {
      return NextResponse.json({ error: 'artworkId and price are required' }, { status: 400 });
    }

    const updated = updateArtworkPrice(artworkId, payload.id, price);
    if (!updated) {
      return NextResponse.json({ error: 'Artwork not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Artwork price successfully updated to ${price}`,
    });
  } catch (err: any) {
    console.error('Apply price error:', err);
    return NextResponse.json({ error: 'Failed to update artwork price' }, { status: 500 });
  }
}
