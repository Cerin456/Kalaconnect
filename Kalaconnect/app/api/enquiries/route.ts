import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { createEnquiry, getEnquiriesByArtistId, updateEnquiryStatus } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { artistId, customerName, customerEmail, customerPhone, enquiryType, message } = body;

    if (!artistId || !customerName || !customerEmail || !message) {
      return NextResponse.json(
        { error: 'Artist, customer name, email, and message are required.' },
        { status: 400 }
      );
    }

    const enquiry = createEnquiry({
      artistId,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      enquiryType: enquiryType || 'custom_commission',
      message,
    });

    return NextResponse.json({
      success: true,
      message: 'Your enquiry has been delivered directly to the artisan.',
      enquiry,
    });
  } catch (err) {
    console.error('Enquiry creation error:', err);
    return NextResponse.json({ error: 'Failed to deliver enquiry' }, { status: 500 });
  }
}

export async function GET(req: Request) {
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

    const enquiries = getEnquiriesByArtistId(payload.id);
    return NextResponse.json({ success: true, enquiries });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
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

    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Enquiry id and status are required' }, { status: 400 });
    }

    const updated = updateEnquiryStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Enquiry marked as ${status}` });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update enquiry status' }, { status: 500 });
  }
}
