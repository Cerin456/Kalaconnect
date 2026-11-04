import { NextResponse } from 'next/server';

interface ArtworkRef {
  title: string;
  medium?: string;
  year?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      theme = 'Traditional Indian Art',
      category = 'Heritage Craft',
      artworks = [],
      artistName = 'Master Artisan',
    }: {
      theme: string;
      category: string;
      artworks: ArtworkRef[];
      artistName: string;
    } = body;

    const count = artworks.length || 1;
    const artTitles = artworks.map((a) => `"${a.title}"`).slice(0, 3).join(', ');

    const titleSuggestions = [
      `${theme}: Echoes of the Ancestral Hand`,
      `Sacred Earth: A Retrospective of ${category}`,
      `Living Traditions: The Mindful Vision of ${artistName}`,
      `${artistName} — Journey Through ${theme}`,
    ];

    const subtitle = `A curated virtual retrospective exploring the timeless geometry, organic pigments, and folk spiritualism of ${category}.`;

    const description = `This virtual exhibition brings together ${count} signature creations by ${artistName}, including ${artTitles || 'masterpiece works'}. Rooted in the rich cultural tapestry of ${theme}, each piece invites patrons into an unhurried sanctuary where ancient technique converges with quiet contemplation. Through natural minerals, sacred geometry, and inherited memory, the collection celebrates India's enduring artisan lineage.`;

    // Suggested display sequence with curator notes
    const sequencedArtworks = artworks.map((art, idx) => ({
      title: art.title,
      displayOrder: idx + 1,
      curatorNote: `Room ${idx + 1}: ${art.title} — Showcasing the harmonious application of ${
        art.medium || 'traditional natural dyes'
      }, setting a meditative cadence for the exhibition.`,
    }));

    return NextResponse.json({
      success: true,
      suggestedTitle: titleSuggestions[0],
      titleSuggestions,
      subtitle,
      description,
      theme,
      sequencedArtworks,
    });
  } catch (err: any) {
    console.error('Curate exhibition error:', err);
    return NextResponse.json({ error: 'Failed to curate exhibition' }, { status: 500 });
  }
}
