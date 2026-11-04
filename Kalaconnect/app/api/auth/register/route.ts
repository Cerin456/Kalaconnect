import { NextResponse } from 'next/server';
import { createArtist, getArtistByEmail } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      craft,
      location,
      experience,
      story,
    } = body;

    if (!firstName || !lastName || !email || !craft) {
      return NextResponse.json(
        { error: 'First name, last name, email, and craft are required.' },
        { status: 400 }
      );
    }

    const existing = getArtistByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An artist account with this email already exists.' },
        { status: 409 }
      );
    }

    const baseSlug = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const slug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

    const newArtist = createArtist({
      slug,
      firstName,
      lastName,
      email,
      phone: phone || '',
      passwordHash: hashPassword(password || 'kala12345'),
      craft,
      category: craft.includes('Pottery')
        ? 'Blue Pottery'
        : craft.includes('Warli')
        ? 'Warli'
        : craft.includes('Weav') || craft.includes('Loom')
        ? 'Handloom'
        : craft.includes('Embroidery')
        ? 'Kutch Embroidery'
        : 'Madhubani',
      location: location || 'India',
      experience: experience || 'Emerging Artisan',
      story:
        story ||
        `Master artisan practicing ${craft} with natural pigments, honoring ancestral traditions passed through generations.`,
      tradition: `Living traditional craft practiced in ${location || 'India'}, centered on generational knowledge and cultural storytelling.`,
      avatarUrl: '/images/artist_meera.png',
      badge: 'Verified Artisan',
    });

    const token = generateToken({ id: newArtist.id, email: newArtist.email });

    const response = NextResponse.json({
      success: true,
      artist: {
        id: newArtist.id,
        slug: newArtist.slug,
        name: `${newArtist.firstName} ${newArtist.lastName}`,
        email: newArtist.email,
        craft: newArtist.craft,
      },
      token,
    });

    response.cookies.set('kala_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
