import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '@/lib/auth';
import { createArtwork, deleteArtwork, getArtworksByArtistId } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const artistId = searchParams.get('artistId');
    if (!artistId) {
      return NextResponse.json({ error: 'artistId query parameter is required' }, { status: 400 });
    }
    const artworks = getArtworksByArtistId(artistId);
    return NextResponse.json({ success: true, artworks });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch artworks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('kala_session')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const contentType = req.headers.get('content-type') || '';

    let title = '';
    let craft = '';
    let medium = '';
    let year = new Date().getFullYear().toString();
    let price = '';
    let dimensions = '';
    let description = '';
    let imageUrl = '/images/art_madhubani.png';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      title = (formData.get('title') as string) || 'Untitled Masterpiece';
      craft = (formData.get('craft') as string) || 'Traditional Indian Craft';
      medium = (formData.get('medium') as string) || 'Handmade natural pigments';
      year = (formData.get('year') as string) || new Date().getFullYear().toString();
      price = (formData.get('price') as string) || 'Price on Enquiry';
      dimensions = (formData.get('dimensions') as string) || '';
      description = (formData.get('description') as string) || '';

      const file = formData.get('image') as File | null;
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name) || '.jpg';
        const filename = `artwork-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });
        fs.writeFileSync(path.join(uploadDir, filename), buffer);
        imageUrl = `/uploads/${filename}`;
      }
    } else {
      const body = await req.json();
      title = body.title;
      craft = body.craft;
      medium = body.medium;
      year = body.year || new Date().getFullYear().toString();
      price = body.price;
      dimensions = body.dimensions;
      description = body.description;
      if (body.imageUrl) imageUrl = body.imageUrl;
    }

    if (!title) {
      return NextResponse.json({ error: 'Artwork title is required' }, { status: 400 });
    }

    const newArtwork = createArtwork({
      artistId: payload.id,
      title,
      craft,
      medium,
      year,
      price,
      dimensions,
      imageUrl,
      description,
    });

    return NextResponse.json({ success: true, artwork: newArtwork });
  } catch (err: any) {
    console.error('Artwork upload error:', err);
    return NextResponse.json({ error: 'Failed to upload artwork' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('kala_session')?.value ||
      req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Artwork ID is required' }, { status: 400 });
    }

    const success = deleteArtwork(id, payload.id);
    if (!success) {
      return NextResponse.json({ error: 'Artwork not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Artwork deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 });
  }
}
