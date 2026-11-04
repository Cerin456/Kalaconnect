'use client';

import { useState, useEffect } from 'react';
import {
  Calculator,
  Sparkles,
  TrendingUp,
  Info,
  CheckCircle,
  AlertCircle,
  Save,
  RotateCcw,
  Tag,
  Clock,
  Coins,
  Layers,
  Trash2,
  Check,
} from 'lucide-react';

interface Artwork {
  id: string;
  title: string;
  craft: string;
  medium: string;
  year: string;
  price?: string;
  dimensions?: string;
  imageUrl: string;
  description: string;
}

interface SavedPricingRecord {
  id: string;
  artworkId?: string;
  artworkTitle: string;
  category: string;
  materialCost: number;
  labourHours: number;
  hourlyRate: number;
  additionalCosts: number;
  complexity: string;
  profitMargin: number;
  productionCost: number;
  suggestedMinPrice: number;
  suggestedMaxPrice: number;
  recommendedPrice: number;
  currency: string;
  aiExplanation?: string;
  marketTips?: string[];
  createdAt: string;
}

interface PricingAdvisorSectionProps {
  artworks: Artwork[];
  artistCraft: string;
  artistExperience: string;
  onArtworkPriceUpdated?: (artworkId: string, newPrice: string) => void;
}

export default function PricingAdvisorSection({
  artworks,
  artistCraft,
  artistExperience,
  onArtworkPriceUpdated,
}: PricingAdvisorSectionProps) {
  const [selectedArtworkId, setSelectedArtworkId] = useState<string>('');
  const [formData, setFormData] = useState({
    artworkTitle: '',
    category: artistCraft || 'Madhubani Painting',
    dimensions: '24" x 36"',
    materials: 'Natural mineral pigments, handmade canvas',
    materialCost: '2500',
    labourHours: '28',
    hourlyRate: '350',
    additionalCosts: '800',
    complexity: 'moderate',
    experienceLevel: artistExperience || '15+ years',
    profitMargin: '25',
    currency: 'INR',
  });

  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<{
    productionCost: number;
    labourCost: number;
    recommendedPrice: number;
    suggestedMinPrice: number;
    suggestedMaxPrice: number;
    estimatedProfit: number;
    currency: string;
    aiExplanation: string;
    marketTips: string[];
  } | null>(null);

  const [savedRecords, setSavedRecords] = useState<SavedPricingRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [savingRecord, setSavingRecord] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyingPrice, setApplyingPrice] = useState(false);
  const [applySuccessMessage, setApplySuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSavedRecords();
  }, []);

  const fetchSavedRecords = async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      if (data.success && data.records) {
        setSavedRecords(data.records);
      }
    } catch (err) {
      console.error('Failed to load saved pricing records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleSelectArtwork = (id: string) => {
    setSelectedArtworkId(id);
    if (!id) return;
    const work = artworks.find((w) => w.id === id);
    if (work) {
      setFormData((prev) => ({
        ...prev,
        artworkTitle: work.title,
        category: work.craft || prev.category,
        dimensions: work.dimensions || prev.dimensions,
        materials: work.medium || prev.materials,
      }));
    }
  };

  const calculateDeterministicFallback = () => {
    const mat = Math.max(0, parseFloat(formData.materialCost) || 0);
    const hours = Math.max(0, parseFloat(formData.labourHours) || 0);
    const rate = Math.max(0, parseFloat(formData.hourlyRate) || 0);
    const extra = Math.max(0, parseFloat(formData.additionalCosts) || 0);
    const margin = Math.max(0, parseFloat(formData.profitMargin) || 0);

    const labour = hours * rate;
    const production = Math.round(mat + labour + extra);

    let compMult = 1.0;
    if (formData.complexity === 'simple') compMult = 0.95;
    if (formData.complexity === 'moderate') compMult = 1.05;
    if (formData.complexity === 'complex') compMult = 1.2;
    if (formData.complexity === 'highly_detailed') compMult = 1.35;

    const baseSelling = production * (1 + margin / 100);
    const recommended = Math.round(baseSelling * compMult);
    const minP = Math.round(production * (1 + (margin * 0.65) / 100));
    const maxP = Math.round(baseSelling * compMult * 1.25);
    const profit = Math.round(recommended - production);

    return {
      productionCost: production,
      labourCost: labour,
      recommendedPrice: recommended,
      suggestedMinPrice: minP,
      suggestedMaxPrice: maxP,
      estimatedProfit: profit,
      currency: formData.currency,
      aiExplanation: `Deterministic Calculation: Based on ${hours} hours of dedicated craftsmanship at ₹${rate}/hr with ₹${mat.toLocaleString()} material expenses, your baseline production cost is ₹${production.toLocaleString()}. Factoring in the ${formData.complexity} complexity and a ${margin}% margin, the suggested retail price is ₹${recommended.toLocaleString()}.`,
      marketTips: [
        'Highlight traditional techniques in your artwork description to reinforce value.',
        'Consider offering certificates of authenticity to justify higher tier prices.',
        'Protect your minimum price threshold during direct patron negotiations.',
      ],
    };
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/ai/pricing-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data);
      } else {
        // Deterministic fallback if API fails
        setResult(calculateDeterministicFallback());
      }
    } catch {
      // Offline / network fallback
      setResult(calculateDeterministicFallback());
    } finally {
      setCalculating(false);
    }
  };

  const handleSavePricing = async () => {
    if (!result) return;
    setSavingRecord(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: selectedArtworkId || undefined,
          ...formData,
          productionCost: result.productionCost,
          suggestedMinPrice: result.suggestedMinPrice,
          suggestedMaxPrice: result.suggestedMaxPrice,
          recommendedPrice: result.recommendedPrice,
          aiExplanation: result.aiExplanation,
          marketTips: result.marketTips,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(true);
        fetchSavedRecords();
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setErrorMessage(data.error || 'Failed to save pricing record');
      }
    } catch {
      setErrorMessage('Network connection error');
    } finally {
      setSavingRecord(false);
    }
  };

  const handleConfirmApplyPrice = async () => {
    if (!selectedArtworkId || !result) return;
    setApplyingPrice(true);
    setErrorMessage('');

    const formattedPrice =
      formData.currency === 'INR'
        ? `₹${result.recommendedPrice.toLocaleString()}`
        : `${formData.currency} ${result.recommendedPrice.toLocaleString()}`;

    try {
      const res = await fetch('/api/pricing/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: selectedArtworkId,
          price: formattedPrice,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApplySuccessMessage(`Successfully updated artwork price to ${formattedPrice}!`);
        if (onArtworkPriceUpdated) {
          onArtworkPriceUpdated(selectedArtworkId, formattedPrice);
        }
        setApplyModalOpen(false);
        setTimeout(() => setApplySuccessMessage(''), 5000);
      } else {
        setErrorMessage(data.error || 'Failed to apply price to artwork');
      }
    } catch {
      setErrorMessage('Network connection error');
    } finally {
      setApplyingPrice(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved pricing record?')) return;
    try {
      const res = await fetch('/api/pricing', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSavedRecords(savedRecords.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleReset = () => {
    setSelectedArtworkId('');
    setFormData({
      artworkTitle: '',
      category: artistCraft || 'Traditional Craft',
      dimensions: '24" x 36"',
      materials: '',
      materialCost: '0',
      labourHours: '0',
      hourlyRate: '300',
      additionalCosts: '0',
      complexity: 'moderate',
      experienceLevel: artistExperience || '10+ years',
      profitMargin: '25',
      currency: 'INR',
    });
    setResult(null);
    setErrorMessage('');
    setSaveSuccess(false);
  };

  const currSymbol = formData.currency === 'INR' ? '₹' : formData.currency;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 section-label mb-2">
            <Calculator size={13} />
            Fair Value Economics
          </div>
          <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
            AI Art Pricing Advisor
          </h3>
          <p className="font-sans text-xs text-[#1A0F0A]/60 mt-1 max-w-xl">
            Estimate a fair, transparent selling price based on actual material costs, dedicated artisan labor,
            craft complexity, and fair trade profit margins.
          </p>
        </div>

        {result && (
          <button
            onClick={handleReset}
            className="border border-[#E7DDD0] bg-white text-[#1A0F0A]/70 px-4 py-2 rounded-lg text-xs font-sans font-semibold hover:bg-[#FAF6EF] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw size={13} />
            Reset Calculator
          </button>
        )}
      </div>

      {applySuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-sans font-medium flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{applySuccessMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs font-sans font-medium flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-7 bg-white border border-[#E7DDD0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7DDD0]/70 pb-4">
            <h4 className="font-serif text-xl font-semibold text-[#1A0F0A]">
              Artwork &amp; Production Details
            </h4>
            <span className="text-[11px] font-sans text-[#702D35] font-semibold bg-[#FAF6EF] px-2.5 py-1 rounded-full border border-[#E7DDD0]">
              Step 1 of 2
            </span>
          </div>

          <form onSubmit={handleCalculate} className="space-y-5">
            {/* Autofill from existing artworks */}
            {artworks.length > 0 && (
              <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-2xl p-4 space-y-2">
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#702D35]">
                  Select an Existing Artwork (Optional Autofill)
                </label>
                <select
                  value={selectedArtworkId}
                  onChange={(e) => handleSelectArtwork(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                >
                  <option value="">-- Or enter custom artwork specifications below --</option>
                  {artworks.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.craft}) — Current Price: {w.price || 'Not set'}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                  Artwork Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kohbar Mithila Tree of Life"
                  value={formData.artworkTitle}
                  onChange={(e) => setFormData({ ...formData, artworkTitle: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                  Craft Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Madhubani Painting"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                  Dimensions
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24 x 36 Inches"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A0F0A]/70 mb-1">
                  Key Materials &amp; Medium
                </label>
                <input
                  type="text"
                  placeholder="e.g. Crushed indigo, turmeric, handmade paper"
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>
            </div>

            {/* Financial Parameters */}
            <div className="pt-2 border-t border-[#E7DDD0]/60">
              <div className="text-xs font-sans font-bold uppercase tracking-wider text-[#1A0F0A]/70 mb-3 flex items-center gap-1.5">
                <Coins size={14} className="text-[#C4522A]" />
                Direct Production Expenses ({formData.currency})
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                    Material Cost ({currSymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.materialCost}
                    onChange={(e) => setFormData({ ...formData, materialCost: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                    Labour Hours (hrs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.labourHours}
                    onChange={(e) => setFormData({ ...formData, labourHours: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                    Hourly Rate ({currSymbol}/hr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                    Additional Expenses ({currSymbol})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="Framing, packaging, studio"
                    value={formData.additionalCosts}
                    onChange={(e) => setFormData({ ...formData, additionalCosts: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                    Desired Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    step="1"
                    value={formData.profitMargin}
                    onChange={(e) => setFormData({ ...formData, profitMargin: e.target.value })}
                    className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                  />
                </div>
              </div>
            </div>

            {/* Complexity & Experience */}
            <div className="grid sm:grid-cols-3 gap-3 pt-2 border-t border-[#E7DDD0]/60">
              <div>
                <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                  Craft Complexity
                </label>
                <select
                  value={formData.complexity}
                  onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                >
                  <option value="simple">Simple / Broad Strokes</option>
                  <option value="moderate">Moderate Detail</option>
                  <option value="complex">Complex &amp; Multi-layer</option>
                  <option value="highly_detailed">Highly Detailed / Heirloom</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                  Artisan Experience
                </label>
                <input
                  type="text"
                  placeholder="e.g. 18 years"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={calculating}
              className="w-full bg-[#702D35] text-white py-3.5 rounded-xl font-sans font-semibold text-xs hover:bg-[#582128] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles size={15} className="text-[#C9A060]" />
              {calculating ? 'Analyzing & Calculating Fair Price...' : 'Generate AI-Assisted Price Recommendation'}
            </button>
          </form>
        </div>

        {/* Right Column: Pricing Results & AI Advice */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C4522A] bg-amber-100/60 px-3 py-1 rounded-full border border-amber-200">
                  Recommended Selling Price
                </span>
                <span className="text-xs font-sans text-[#1A0F0A]/50">
                  {formData.currency}
                </span>
              </div>

              {/* Primary Highlight Price */}
              <div className="bg-white rounded-2xl p-6 border border-[#E7DDD0] text-center space-y-1 shadow-sm">
                <div className="text-xs font-sans text-[#1A0F0A]/60">Suggested Fair Market Value</div>
                <div className="font-serif text-4xl sm:text-5xl font-bold text-[#702D35]">
                  {currSymbol} {result.recommendedPrice.toLocaleString()}
                </div>
                <div className="text-xs font-sans text-emerald-700 font-semibold pt-1">
                  Includes ~{currSymbol} {result.estimatedProfit.toLocaleString()} Artisan Profit
                </div>
              </div>

              {/* Price Range & Production Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-4 border border-[#E7DDD0]">
                  <div className="text-[10px] font-sans uppercase font-bold text-[#1A0F0A]/50">
                    Min Price (Floor)
                  </div>
                  <div className="font-serif text-xl font-bold text-[#1A0F0A] mt-0.5">
                    {currSymbol} {result.suggestedMinPrice.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-sans text-[#1A0F0A]/50 mt-1">
                    Protects cost &amp; baseline wage
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-[#E7DDD0]">
                  <div className="text-[10px] font-sans uppercase font-bold text-[#1A0F0A]/50">
                    Max Price (Gallery)
                  </div>
                  <div className="font-serif text-xl font-bold text-[#1A0F0A] mt-0.5">
                    {currSymbol} {result.suggestedMaxPrice.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-sans text-[#1A0F0A]/50 mt-1">
                    For collectors / exhibitions
                  </div>
                </div>
              </div>

              {/* Cost Accounting Breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-[#E7DDD0] space-y-2.5 text-xs font-sans">
                <div className="font-sans font-bold text-[#1A0F0A] border-b border-[#E7DDD0]/60 pb-2">
                  Cost Breakdown
                </div>
                <div className="flex justify-between text-[#1A0F0A]/70">
                  <span>Raw Materials:</span>
                  <span className="font-medium text-[#1A0F0A]">{currSymbol} {Number(formData.materialCost).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#1A0F0A]/70">
                  <span>Artisan Labour ({formData.labourHours} hrs @ {currSymbol} {formData.hourlyRate}):</span>
                  <span className="font-medium text-[#1A0F0A]">{currSymbol} {result.labourCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#1A0F0A]/70">
                  <span>Additional Expenses:</span>
                  <span className="font-medium text-[#1A0F0A]">{currSymbol} {Number(formData.additionalCosts).toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-[#E7DDD0]/60 pt-2 text-[#702D35]">
                  <span>Total Production Cost:</span>
                  <span>{currSymbol} {result.productionCost.toLocaleString()}</span>
                </div>
              </div>

              {/* AI Explanation */}
              <div className="bg-white rounded-2xl p-5 border border-[#E7DDD0] space-y-2 text-xs font-sans">
                <div className="font-sans font-bold text-[#702D35] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#C9A060]" />
                  AI Pricing Rationale
                </div>
                <p className="text-[#1A0F0A]/75 leading-relaxed">
                  {result.aiExplanation}
                </p>
              </div>

              {/* Market Tips */}
              {result.marketTips && result.marketTips.length > 0 && (
                <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/60 space-y-2 text-xs font-sans">
                  <div className="font-sans font-bold text-[#C4522A] flex items-center gap-1.5">
                    <TrendingUp size={14} />
                    Commercial Presentation Advice
                  </div>
                  <ul className="space-y-1.5 text-[#1A0F0A]/70 list-disc list-inside">
                    {result.marketTips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleSavePricing}
                    disabled={savingRecord}
                    className="flex-1 bg-[#702D35] text-white py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Save size={14} />
                    {savingRecord ? 'Saving...' : saveSuccess ? '✓ Pricing Saved!' : 'Save Pricing Record'}
                  </button>

                  {selectedArtworkId && (
                    <button
                      onClick={() => setApplyModalOpen(true)}
                      className="flex-1 bg-[#C4522A] text-white py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#a3411e] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Tag size={14} />
                      Apply to Artwork Listing
                    </button>
                  )}
                </div>

                {!selectedArtworkId && (
                  <p className="text-[11px] font-sans text-[#1A0F0A]/50 text-center">
                    Select an existing artwork from the dropdown to apply this price directly to your public listing.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E7DDD0] rounded-3xl p-10 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EF] text-[#702D35] flex items-center justify-center mx-auto border border-[#E7DDD0]">
                <Calculator size={28} />
              </div>
              <h4 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                Ready to Calculate
              </h4>
              <p className="font-sans text-xs text-[#1A0F0A]/60 max-w-xs mx-auto leading-relaxed">
                Fill in your materials, labor hours, and complexity details on the left, then click{' '}
                <strong>Generate AI-Assisted Price</strong> to see a transparent price breakdown and commercial guidance.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Applying Price to Listing */}
      {applyModalOpen && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E7DDD0] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
              Confirm Listing Price Update
            </h3>
            <p className="font-sans text-xs text-[#1A0F0A]/70 leading-relaxed">
              Are you sure you want to update the public catalog price of{' '}
              <strong className="text-[#702D35]">{formData.artworkTitle || 'this artwork'}</strong> to{' '}
              <strong className="text-emerald-700">
                {currSymbol} {result.recommendedPrice.toLocaleString()}
              </strong>?
            </p>
            <p className="text-[11px] font-sans text-[#1A0F0A]/50 bg-[#FAF6EF] p-3 rounded-xl border border-[#E7DDD0]">
              This change will update your artwork price in your public portfolio and digital exhibition listings.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="flex-1 border border-[#E7DDD0] bg-white py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#FAF6EF]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={applyingPrice}
                onClick={handleConfirmApplyPrice}
                className="flex-1 bg-[#702D35] text-white py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-colors"
              >
                {applyingPrice ? 'Updating...' : 'Yes, Update Price'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Pricing Records History */}
      <div className="bg-white border border-[#E7DDD0] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
              Saved Pricing Assessments ({savedRecords.length})
            </h4>
            <p className="font-sans text-xs text-[#1A0F0A]/60 mt-0.5">
              Historical pricing calculations associated with your artist account.
            </p>
          </div>
        </div>

        {loadingRecords ? (
          <div className="text-center py-8 text-xs font-sans text-[#1A0F0A]/50">
            Loading pricing history...
          </div>
        ) : savedRecords.length === 0 ? (
          <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-2xl p-8 text-center text-xs font-sans text-[#1A0F0A]/60">
            No pricing records saved yet. Calculate an artwork price above and click &ldquo;Save Pricing Record&rdquo; to build your commercial pricing archive.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRecords.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-2xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="font-serif text-lg font-semibold text-[#1A0F0A] truncate">
                      {rec.artworkTitle}
                    </h5>
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="text-[#1A0F0A]/40 hover:text-rose-600 transition-colors p-1"
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="text-[11px] font-sans text-[#1A0F0A]/60 mt-0.5">
                    {rec.category} &bull; {rec.complexity}
                  </div>
                </div>

                <div className="space-y-1 py-1 border-y border-[#E7DDD0]/60 text-xs font-sans">
                  <div className="flex justify-between text-[#1A0F0A]/70">
                    <span>Recommended Price:</span>
                    <strong className="text-[#702D35] font-semibold">
                      {rec.currency === 'INR' ? '₹' : rec.currency} {rec.recommendedPrice.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#1A0F0A]/60 text-[11px]">
                    <span>Production Cost:</span>
                    <span>{rec.currency === 'INR' ? '₹' : rec.currency} {rec.productionCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#1A0F0A]/60 text-[11px]">
                    <span>Labour Hours:</span>
                    <span>{rec.labourHours} hrs</span>
                  </div>
                </div>

                <div className="text-[10px] font-sans text-[#1A0F0A]/40 flex justify-between items-center">
                  <span>Saved on {new Date(rec.createdAt).toLocaleDateString()}</span>
                  <span className="capitalize text-[#C4522A] font-semibold">{rec.complexity}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
