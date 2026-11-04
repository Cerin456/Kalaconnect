import { NextResponse } from 'next/server';
import { getArtistByEmail, getAllArtists } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Lookup by email or phone
    let artist = getArtistByEmail(email);
    if (!artist) {
      const all = getAllArtists();
      artist = all.find((a) => a.phone === email || a.email.toLowerCase() === email.toLowerCase());
    }

    if (!artist || !artist.passwordHash) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, artist.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    const token = generateToken({ id: artist.id, email: artist.email });

    const response = NextResponse.json({
      success: true,
      artist: {
        id: artist.id,
        slug: artist.slug,
        name: `${artist.firstName} ${artist.lastName}`,
        email: artist.email,
        craft: artist.craft,
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
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
