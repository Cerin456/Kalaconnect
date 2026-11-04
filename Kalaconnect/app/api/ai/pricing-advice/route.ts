import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      artworkTitle,
      category,
      materials,
      materialCost = 0,
      labourHours = 0,
      hourlyRate = 0,
      additionalCosts = 0,
      complexity = 'moderate',
      experienceLevel = '15 years',
      profitMargin = 25,
      currency = 'INR',
    } = body;

    // Deterministic foundational calculations
    const numMatCost = Math.max(0, Number(materialCost) || 0);
    const numHours = Math.max(0, Number(labourHours) || 0);
    const numRate = Math.max(0, Number(hourlyRate) || 0);
    const numAdditional = Math.max(0, Number(additionalCosts) || 0);
    const numMargin = Math.max(0, Number(profitMargin) || 0);

    const labourCost = numHours * numRate;
    const productionCost = Math.round(numMatCost + labourCost + numAdditional);

    // Complexity multiplier
    let complexityMultiplier = 1.0;
    if (complexity === 'simple') complexityMultiplier = 0.95;
    else if (complexity === 'moderate') complexityMultiplier = 1.05;
    else if (complexity === 'complex') complexityMultiplier = 1.2;
    else if (complexity === 'highly_detailed') complexityMultiplier = 1.35;

    // Suggested prices
    const baseSellingPrice = productionCost * (1 + numMargin / 100);
    const recommendedPrice = Math.round(baseSellingPrice * complexityMultiplier);
    const suggestedMinPrice = Math.round(productionCost * (1 + (numMargin * 0.65) / 100));
    const suggestedMaxPrice = Math.round(baseSellingPrice * complexityMultiplier * 1.25);
    const estimatedProfit = Math.round(recommendedPrice - productionCost);

    // Curated AI Rationale and Presentation Insights
    const title = artworkTitle || 'this handcrafted work';
    const craft = category || 'Traditional Indian Craft';
    const matText = materials || 'natural organic pigments and heritage media';

    const aiExplanation = `Based on your investment of ${numHours} mindful hours at ${currency === 'INR' ? '₹' : currency} ${numRate}/hr alongside ${currency === 'INR' ? '₹' : currency} ${numMatCost.toLocaleString()} in authentic materials (${matText}), your base production cost stands at ${currency === 'INR' ? '₹' : currency} ${productionCost.toLocaleString()}. 
Given the ${complexity.replace('_', ' ')} complexity inherent to traditional ${craft} and your artisan experience (${experienceLevel}), a fair market value for "${title}" is recommended at ${currency === 'INR' ? '₹' : currency} ${recommendedPrice.toLocaleString()}, securing an estimated artisan profit of ${currency === 'INR' ? '₹' : currency} ${estimatedProfit.toLocaleString()} (${numMargin}% target margin).`;

    const marketTips = [
      `Highlight the provenance of your ${matText} in the artwork description to justify premium pricing to conscious collectors.`,
      `For gallery exhibitions and overseas buyers, consider the upper range (${currency === 'INR' ? '₹' : currency} ${suggestedMaxPrice.toLocaleString()}) which comfortably absorbs framing, insurance, and collector documentation.`,
      `Offer a Certificate of Authenticity specifying that "${title}" required ${numHours} hours of traditional handcrafting.`,
      `Keep the minimum threshold (${currency === 'INR' ? '₹' : currency} ${suggestedMinPrice.toLocaleString()}) firm during retail patron negotiations to ensure your labor is never undervalued.`,
    ];

    return NextResponse.json({
      success: true,
      productionCost,
      labourCost,
      recommendedPrice,
      suggestedMinPrice,
      suggestedMaxPrice,
      estimatedProfit,
      currency,
      aiExplanation,
      marketTips,
    });
  } catch (err: any) {
    console.error('Pricing advice error:', err);
    return NextResponse.json({ error: 'Failed to generate pricing advice' }, { status: 500 });
  }
}
