import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { verifyToken } from '@/lib/auth';

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

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 25MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const filename = `journey-${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), buffer);

    const isVideo = file.type.startsWith('video/') || ['.mp4', '.webm', '.mov'].includes(ext.toLowerCase());

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      mediaType: isVideo ? 'video' : 'image',
    });
  } catch (err: any) {
    console.error('Media upload error:', err);
    return NextResponse.json({ error: 'Failed to upload media file' }, { status: 500 });
  }
}
