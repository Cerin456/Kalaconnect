import { NextResponse } from 'next/server';
import { getAllArtists } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'All';

    let artists = getAllArtists();

    if (category !== 'All') {
      artists = artists.filter(
        (a) => a.category.toLowerCase() === category.toLowerCase() || a.craft.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (search) {
      artists = artists.filter(
        (a) =>
          a.firstName.toLowerCase().includes(search) ||
          a.lastName.toLowerCase().includes(search) ||
          a.craft.toLowerCase().includes(search) ||
          a.location.toLowerCase().includes(search)
      );
    }

    // Strip passwordHash
    const safeArtists = artists.map(({ passwordHash, ...rest }) => rest);

    return NextResponse.json({ success: true, count: safeArtists.length, artists: safeArtists });
  } catch (err) {
    console.error('Artists fetch error:', err);
    return NextResponse.json({ error: 'Failed to fetch artists' }, { status: 500 });
  }
}
