import { NextResponse } from 'next/server';

interface StageInput {
  stageTitle: string;
  description: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { artworkTitle, craft, stages = [] }: { artworkTitle: string; craft: string; stages: StageInput[] } = body;

    const title = artworkTitle || 'Traditional Masterpiece';
    const craftName = craft || 'Indian Heritage Art';

    // Build stage summary
    const stageSummaries = stages
      .filter((s) => s.stageTitle && s.description)
      .map((s, idx) => `Stage ${idx + 1} (${s.stageTitle}): ${s.description}`)
      .join(' ');

    const journeyTitle = `The Living Genesis of ${title}: An Artisan's Odyssey`;
    const introduction = `Every sacred piece of ${craftName} begins long before the first stroke touches the canvas. It begins with inherited memories, mindful preparation of organic elements, and quiet devotion to ancestral lineage. Follow the step-by-step unfolding of "${title}" from inception to completion.`;

    const fullStory = `The creation of "${title}" exemplifies the unhurried patience of ${craftName}. ${
      stageSummaries || 'Beginning with spiritual centering and raw material selection, the artisan meticulously prepared each pigment and surface according to age-old protocols.'
    } Each layer preserves hours of dedicated craftsmanship, celebrating the profound synergy between human hand and natural world. The final piece stands not merely as an aesthetic achievement, but as a living bridge between generations of tradition.`;

    const keywords = [
      craftName,
      'Handmade Heritage',
      'Artisan Process',
      'Traditional Craftsmanship',
      'Indian Folk Art',
      'Behind The Canvas',
    ];

    const socialDescription = `Step into the studio and witness the sacred step-by-step creation of "${title}", handcrafted through centuries-old ${craftName} traditions. Explore the creative journey on KalaConnect. #TraditionalArt #${craftName.replace(/\s+/g, '')} #ArtisanHeritage #KalaConnect`;

    return NextResponse.json({
      success: true,
      title: journeyTitle,
      introduction,
      fullStory,
      keywords,
      socialDescription,
    });
  } catch (err: any) {
    console.error('Generate journey error:', err);
    return NextResponse.json({ error: 'Failed to generate journey narrative' }, { status: 500 });
  }
}
