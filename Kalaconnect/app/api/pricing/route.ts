import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import {
  getPricingRecordsByArtistId,
  createPricingRecord,
  deletePricingRecord,
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
    const payload = await getAuthArtist(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const records = getPricingRecordsByArtistId(payload.id);
    return NextResponse.json({ success: true, records });
  } catch (err: any) {
    console.error('Fetch pricing records error:', err);
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
      artworkTitle,
      category,
      dimensions,
      materials,
      materialCost,
      labourHours,
      hourlyRate,
      additionalCosts,
      complexity,
      experienceLevel,
      profitMargin,
      productionCost,
      suggestedMinPrice,
      suggestedMaxPrice,
      recommendedPrice,
      currency,
      aiExplanation,
      marketTips,
    } = body;

    if (!artworkTitle) {
      return NextResponse.json({ error: 'Artwork title is required' }, { status: 400 });
    }

    const newRecord = createPricingRecord({
      artistId: payload.id,
      artworkId,
      artworkTitle,
      category: category || 'Traditional Indian Craft',
      dimensions,
      materials,
      materialCost: Number(materialCost) || 0,
      labourHours: Number(labourHours) || 0,
      hourlyRate: Number(hourlyRate) || 0,
      additionalCosts: Number(additionalCosts) || 0,
      complexity: complexity || 'moderate',
      experienceLevel,
      profitMargin: Number(profitMargin) || 25,
      productionCost: Number(productionCost) || 0,
      suggestedMinPrice: Number(suggestedMinPrice) || 0,
      suggestedMaxPrice: Number(suggestedMaxPrice) || 0,
      recommendedPrice: Number(recommendedPrice) || 0,
      currency: currency || 'INR',
      aiExplanation,
      marketTips,
    });

    return NextResponse.json({ success: true, record: newRecord });
  } catch (err: any) {
    console.error('Create pricing record error:', err);
    return NextResponse.json({ error: 'Failed to save pricing record' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const payload = await getAuthArtist(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Record ID is required' }, { status: 400 });
    }

    const success = deletePricingRecord(id, payload.id);
    if (!success) {
      return NextResponse.json({ error: 'Record not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Pricing record deleted' });
  } catch (err: any) {
    console.error('Delete pricing record error:', err);
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 });
  }
}
