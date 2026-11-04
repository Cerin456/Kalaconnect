import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { craft, artworkTitle, medium, region } = await req.json();

    if (!craft) {
      return NextResponse.json({ error: 'Craft name is required' }, { status: 400 });
    }

    const titleStr = artworkTitle || 'this handcrafted creation';
    const regionStr = region || 'India';
    const mediumStr = medium || 'natural organic pigments';

    // Curated cultural narrative generator
    const narratives: Record<string, string[]> = {
      'madhubani': [
        `Rooted in the ancient Mithila tradition of ${regionStr}, ${titleStr} honors the sacred union of nature and human devotion. Rendered using ${mediumStr}, the delicate double-line borders and cosmic geometries echo prayers whispered across generations of village women.`,
        `Every brushstroke in ${titleStr} carries the rhythm of folk lore and harvest songs. Handcrafted with ${mediumStr}, it transforms ancestral wisdom into a living canvas of protection and fertility.`,
      ],
      'pottery': [
        `Shaped with patience on the traditional potter's wheel in ${regionStr}, ${titleStr} brings earth and fire into quiet equilibrium. Using ${mediumStr}, each contour reflects hours of mindful centering, celebrating the beauty of conscious imperfection.`,
        `In an era of mass production, ${titleStr} stands as a testament to the artisan's tactile memory. Fired with traditional techniques, the natural glaze preserves mineral depth that only handmade pottery can evoke.`,
      ],
      'warli': [
        `Evoking the timeless harmony between tribe and forest, ${titleStr} uses primal geometric vocabulary to depict community unity. Crafted using ${mediumStr}, the circle of the sun and the triangle of sacred mountains converge in celebratory Tarpa dance.`,
        `Unvarnished and profound, ${titleStr} captures the unhurried cadence of agrarian life in ${regionStr}. Hand-painted using ${mediumStr}, it invites the viewer into a communal ritual of gratitude.`,
      ],
      'loom': [
        `Woven on ancestral wooden pit looms, ${titleStr} is an interlacing of history, patience, and touch. Each thread of ${mediumStr} was hand-wound under the warm sun of ${regionStr}, creating a drape that softens with age and whispers tales of artisan lineage.`,
        `From raw fiber to luminous textile, ${titleStr} embodies weeks of rhythmic shuttle movements. Crafted with ${mediumStr}, it pays homage to India's unmatched textile heritage.`,
      ],
      'embroidery': [
        `Stitched stitch-by-stitch beneath desert starlight, ${titleStr} reflects the vibrant spirit of ${regionStr}. Adorned with ${mediumStr}, its reflective mirrors ward off ill-will while shining with familial affection and nomadic legacy.`,
        `Intricate and enduring, ${titleStr} features heirloom needlework passed from mother to daughter. The marriage of ${mediumStr} creates a dimensional tapestry that celebrates vibrant desert identity.`,
      ],
    };

    let matched = narratives['madhubani'][0];
    const lowerCraft = craft.toLowerCase();

    if (lowerCraft.includes('potter')) matched = narratives['pottery'][0];
    else if (lowerCraft.includes('warli')) matched = narratives['warli'][0];
    else if (lowerCraft.includes('loom') || lowerCraft.includes('weav')) matched = narratives['loom'][0];
    else if (lowerCraft.includes('embroid') || lowerCraft.includes('kutch')) matched = narratives['embroidery'][0];
    else if (lowerCraft.includes('madhubani') || lowerCraft.includes('mithila')) matched = narratives['madhubani'][1];

    return NextResponse.json({
      success: true,
      story: matched,
      suggestedTitle: `${craft} — The Living Breath`,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }
}
