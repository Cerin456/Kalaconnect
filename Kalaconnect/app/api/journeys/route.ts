import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getJourneysByArtistId, createJourney, getArtworksByArtistId } from '@/lib/db';

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
    const payload = await getAuthArtist(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const journeys = getJourneysByArtistId(payload.id);
    const artworks = getArtworksByArtistId(payload.id);

    return NextResponse.json({ success: true, journeys, artworks });
  } catch (err: any) {
    console.error('Fetch journeys error:', err);
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
      artworkId,
      title,
      introduction,
      fullStory,
      keywords,
      socialDescription,
      stages = [],
      visibility = 'public',
      published = true,
    } = body;

    if (!artworkId || !title) {
      return NextResponse.json({ error: 'Artwork and journey title are required' }, { status: 400 });
    }

    const formattedStages = stages.map((s: any, idx: number) => ({
      id: s.id || `stage-${Date.now()}-${idx}`,
      stageTitle: s.stageTitle || `Stage ${idx + 1}`,
      description: s.description || '',
      mediaUrl: s.mediaUrl || '/images/hero_collage.png',
      mediaType: s.mediaType || 'image',
      stageOrder: s.stageOrder !== undefined ? s.stageOrder : idx,
      stageDate: s.stageDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    }));

    const newJourney = createJourney({
      artistId: payload.id,
      artworkId,
      title,
      introduction: introduction || '',
      fullStory: fullStory || '',
      keywords: keywords || [],
      socialDescription: socialDescription || '',
      stages: formattedStages,
      visibility,
      published,
    });

    return NextResponse.json({ success: true, journey: newJourney });
  } catch (err: any) {
    console.error('Create journey error:', err);
    return NextResponse.json({ error: 'Failed to create creative journey' }, { status: 500 });
  }
}
