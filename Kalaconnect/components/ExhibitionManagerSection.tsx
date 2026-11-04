'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Eye,
  ExternalLink,
  Share2,
  QrCode,
  CheckCircle,
  AlertCircle,
  Globe,
  Layers,
  ArrowUp,
  ArrowDown,
  Palette,
  Tag,
  Copy,
  Check,
} from 'lucide-react';
import { generateQRCodeSVG } from '@/lib/qrcode';

interface Artwork {
  id: string;
  title: string;
  craft: string;
  medium: string;
  imageUrl: string;
  year?: string;
  price?: string;
  description: string;
}

interface ExhibitionArtworkRef {
  artworkId: string;
  displayOrder: number;
  customDescription?: string;
}

interface Exhibition {
  id: string;
  artistId: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  theme: string;
  category: string;
  coverImage: string;
  startDate: string;
  endDate?: string;
  visibility: 'public' | 'private';
  published: boolean;
  artworks: ExhibitionArtworkRef[];
  viewsCount: number;
  createdAt: string;
}

interface ExhibitionManagerSectionProps {
  artworks: Artwork[];
  artistCraft: string;
  artistName: string;
}

const THEME_PRESETS = [
  'Traditional Indian Art',
  'Kerala Heritage',
  'Contemporary Folk Art',
  'Women in Traditional Art',
  'Nature and Culture',
  'Festival Special',
  'Handmade Creations',
];

export default function ExhibitionManagerSection({
  artworks,
  artistCraft,
  artistName,
}: ExhibitionManagerSectionProps) {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [curatingAI, setCuratingAI] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState(THEME_PRESETS[0]);
  const [customTheme, setCustomTheme] = useState('');
  const [category, setCategory] = useState(artistCraft || 'Traditional Craft');
  const [coverImage, setCoverImage] = useState(artworks[0]?.imageUrl || '/images/hero_collage.png');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [published, setPublished] = useState(true);
  const [selectedArtworks, setSelectedArtworks] = useState<
    { artworkId: string; displayOrder: number; customDescription: string }[]
  >([]);

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/exhibitions');
      const data = await res.json();
      if (data.success && data.exhibitions) {
        setExhibitions(data.exhibitions);
      }
    } catch (err) {
      console.error('Failed to load exhibitions:', err);
    } finally {
      setLoading(false);
    }
  };

  const startNewExhibition = () => {
    if (artworks.length === 0) {
      setErrorMsg('Please upload at least one artwork before creating a virtual exhibition.');
      return;
    }
    setTitle(`${theme}: The Living Breath of ${artistCraft}`);
    setSubtitle(`A curated virtual retrospective exploring authentic ${artistCraft} masterpieces.`);
    setDescription(
      `Welcome to this curated digital pavilion presenting traditional creations by ${artistName}. Every piece is rendered with sacred patience and heritage mineral pigments.`
    );
    setTheme(THEME_PRESETS[0]);
    setCoverImage(artworks[0]?.imageUrl || '/images/hero_collage.png');
    // Pre-select first 2 artworks by default if available
    setSelectedArtworks(
      artworks.slice(0, 3).map((w, idx) => ({
        artworkId: w.id,
        displayOrder: idx + 1,
        customDescription: w.description || '',
      }))
    );
    setIsCreating(true);
    setErrorMsg('');
  };

  const toggleSelectArtwork = (artId: string) => {
    const exists = selectedArtworks.some((a) => a.artworkId === artId);
    if (exists) {
      const updated = selectedArtworks.filter((a) => a.artworkId !== artId);
      setSelectedArtworks(updated.map((a, idx) => ({ ...a, displayOrder: idx + 1 })));
    } else {
      const work = artworks.find((w) => w.id === artId);
      setSelectedArtworks([
        ...selectedArtworks,
        {
          artworkId: artId,
          displayOrder: selectedArtworks.length + 1,
          customDescription: work?.description || '',
        },
      ]);
    }
  };

  const handleMoveArtwork = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= selectedArtworks.length) return;
    const reordered = [...selectedArtworks];
    const temp = reordered[index];
    reordered[index] = reordered[target];
    reordered[target] = temp;
    setSelectedArtworks(reordered.map((a, idx) => ({ ...a, displayOrder: idx + 1 })));
  };

  const handleCurateAI = async () => {
    if (selectedArtworks.length === 0) {
      alert('Please select at least one artwork to curate.');
      return;
    }

    setCuratingAI(true);
    const chosenTheme = customTheme.trim() || theme;
    const chosenWorks = selectedArtworks
      .map((item) => artworks.find((w) => w.id === item.artworkId))
      .filter(Boolean) as Artwork[];

    try {
      const res = await fetch('/api/ai/curate-exhibition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: chosenTheme,
          category,
          artistName,
          artworks: chosenWorks.map((w) => ({ title: w.title, medium: w.medium, year: w.year })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.suggestedTitle) setTitle(data.suggestedTitle);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.description) setDescription(data.description);
      }
    } catch (err) {
      console.error('AI curation error:', err);
    } finally {
      setCuratingAI(false);
    }
  };

  const handleSaveExhibition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || selectedArtworks.length === 0) {
      setErrorMsg('Please specify an exhibition title and select at least one artwork.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const chosenTheme = customTheme.trim() || theme;
      const res = await fetch('/api/exhibitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          description,
          theme: chosenTheme,
          category,
          coverImage,
          startDate,
          endDate: endDate || undefined,
          visibility,
          published,
          artworks: selectedArtworks,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Virtual exhibition published successfully!');
        setIsCreating(false);
        fetchExhibitions();
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setErrorMsg(data.error || 'Failed to save exhibition.');
      }
    } catch {
      setErrorMsg('Network error while creating exhibition.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExhibition = async (id: string) => {
    if (!confirm('Are you sure you want to delete this virtual exhibition?')) return;
    try {
      const res = await fetch(`/api/exhibitions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setExhibitions(exhibitions.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete exhibition:', err);
    }
  };

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/exhibitions/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 section-label mb-2">
            <Palette size={13} />
            Virtual Gallery Pavilions
          </div>
          <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
            Digital Exhibition Creator
          </h3>
          <p className="font-sans text-xs text-[#1A0F0A]/60 mt-1 max-w-xl">
            Curate your own themed virtual art exhibitions without needing a physical gallery. Publish dedicated
            shareable exhibition spaces with printable QR codes for festivals and patrons worldwide.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={startNewExhibition}
            className="bg-[#702D35] text-white px-5 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={15} />
            Create Virtual Exhibition
          </button>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-sans font-medium flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-xs font-sans font-medium flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CREATION FORM */}
      {isCreating ? (
        <div className="bg-white border border-[#E7DDD0] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7DDD0]/70 pb-4">
            <div>
              <h4 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                Curating New Exhibition
              </h4>
              <p className="text-xs font-sans text-[#1A0F0A]/60 mt-0.5">
                Organize artworks by theme, generate professional curator notes with AI, and publish a virtual gallery.
              </p>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-sans font-semibold text-[#1A0F0A]/60 hover:text-[#1A0F0A] border border-[#E7DDD0] px-3.5 py-1.5 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveExhibition} className="space-y-8">
            {/* Theme & Category Selection */}
            <div className="space-y-3 bg-[#FAF6EF] border border-[#E7DDD0] rounded-2xl p-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#702D35]">
                1. Select Exhibition Theme
              </label>
              <div className="flex flex-wrap gap-2">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTheme(t);
                      setCustomTheme('');
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-sans font-semibold transition-all ${
                      theme === t && !customTheme
                        ? 'bg-[#702D35] text-white shadow-sm'
                        : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Or enter a custom theme (e.g. Sacred Forests of the Western Ghats)..."
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A0F0A]/70 mb-1.5">
                  Exhibition Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Earth & Fire: Blue Pottery Retrospective"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A0F0A]/70 mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. An exploration of turquoise luster and sacred geometry"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>
            </div>

            {/* Curator Description with AI */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A0F0A]/70">
                  Curator Note &amp; Narrative Description *
                </label>
                <button
                  type="button"
                  onClick={handleCurateAI}
                  disabled={curatingAI}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#702D35] hover:text-[#582128]"
                >
                  <Sparkles size={13} className="text-[#C9A060]" />
                  {curatingAI ? 'Curating with AI...' : '✨ Curate Narrative with AI'}
                </button>
              </div>
              <textarea
                rows={3}
                required
                placeholder="Share the overarching artistic narrative uniting these selected works..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35] resize-none"
              />
            </div>

            {/* Artwork Selection & Sequence */}
            <div className="space-y-4">
              <div>
                <h5 className="font-serif text-xl font-semibold text-[#1A0F0A]">
                  Select Artworks for this Exhibition ({selectedArtworks.length} Selected)
                </h5>
                <p className="text-xs font-sans text-[#1A0F0A]/60">
                  Click artworks below to add or remove them from your virtual exhibition pavilion.
                </p>
              </div>

              {/* Artwork Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {artworks.map((work) => {
                  const isSelected = selectedArtworks.some((a) => a.artworkId === work.id);
                  const selectedOrder = selectedArtworks.findIndex((a) => a.artworkId === work.id) + 1;

                  return (
                    <div
                      key={work.id}
                      onClick={() => toggleSelectArtwork(work.id)}
                      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#702D35] shadow-md ring-2 ring-[#702D35]/20'
                          : 'border-[#E7DDD0] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="relative aspect-[4/3] bg-[#FAF6EF]">
                        <Image src={work.imageUrl} alt={work.title} fill className="object-cover" />
                        {isSelected && (
                          <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#702D35] text-white text-[11px] font-bold flex items-center justify-center shadow">
                            {selectedOrder}
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-white space-y-0.5">
                        <div className="font-serif text-sm font-semibold text-[#1A0F0A] truncate">
                          {work.title}
                        </div>
                        <div className="text-[10px] font-sans text-[#1A0F0A]/50">{work.craft}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Display Sequence Order */}
              {selectedArtworks.length > 0 && (
                <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-2xl p-4 space-y-3 mt-4">
                  <div className="text-xs font-sans font-bold uppercase tracking-wider text-[#702D35]">
                    Virtual Room Sequence &amp; Artwork Captions
                  </div>
                  <div className="space-y-2">
                    {selectedArtworks.map((item, idx) => {
                      const work = artworks.find((w) => w.id === item.artworkId);
                      if (!work) return null;

                      return (
                        <div
                          key={item.artworkId}
                          className="bg-white border border-[#E7DDD0] rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-sans"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-[#FAF6EF] border border-[#E7DDD0] text-[#702D35] font-bold text-[10px] flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[#E7DDD0]">
                              <Image src={work.imageUrl} alt={work.title} fill className="object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-[#1A0F0A]">{work.title}</div>
                              <div className="text-[11px] text-[#1A0F0A]/50">{work.medium}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveArtwork(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded text-[#1A0F0A]/40 hover:text-[#1A0F0A] disabled:opacity-20"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveArtwork(idx, 'down')}
                              disabled={idx === selectedArtworks.length - 1}
                              className="p-1 rounded text-[#1A0F0A]/40 hover:text-[#1A0F0A] disabled:opacity-20"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleSelectArtwork(item.artworkId)}
                              className="p-1 rounded text-[#1A0F0A]/40 hover:text-rose-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dates & Visibility */}
            <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-[#E7DDD0]/70">
              <div>
                <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                  Exhibition Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#1A0F0A]/70 mb-1">
                  Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans"
                >
                  <option value="public">Public (Shareable Link &amp; QR)</option>
                  <option value="private">Private (Only You)</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="border border-[#E7DDD0] bg-white text-[#1A0F0A]/70 px-6 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#FAF6EF]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#702D35] text-white px-8 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-all shadow-sm"
              >
                {saving ? 'Publishing Exhibition...' : 'Publish Digital Exhibition'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* EXHIBITIONS LIST */
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-xs font-sans text-[#1A0F0A]/50">
              Loading exhibitions...
            </div>
          ) : exhibitions.length === 0 ? (
            <div className="bg-white border border-[#E7DDD0] rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EF] text-[#702D35] flex items-center justify-center mx-auto border border-[#E7DDD0]">
                <Palette size={28} />
              </div>
              <h4 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                No Digital Exhibitions Created Yet
              </h4>
              <p className="font-sans text-xs text-[#1A0F0A]/60 max-w-sm mx-auto leading-relaxed">
                Organize your artworks into a themed virtual gallery. You&apos;ll get a public exhibition URL,
                visitor view metrics, and printable QR codes for festival booths.
              </p>
              <button
                onClick={startNewExhibition}
                className="bg-[#702D35] text-white px-6 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-all"
              >
                Create Your First Exhibition
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exhibitions.map((exh) => {
                const firstArtId = exh.artworks?.[0]?.artworkId;
                const coverArt = artworks.find((w) => w.id === firstArtId);
                const displayCover = exh.coverImage || coverArt?.imageUrl || '/images/hero_collage.png';

                return (
                  <div
                    key={exh.id}
                    className="bg-white border border-[#E7DDD0] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-[#FAF6EF]">
                        <Image src={displayCover} alt={exh.title} fill className="object-cover" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span
                            className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                              exh.published ? 'bg-emerald-500 text-white' : 'bg-neutral-800 text-white'
                            }`}
                          >
                            {exh.published ? 'Live' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-sans uppercase font-bold text-[#C4522A]">
                          <span>{exh.theme}</span>
                          <span className="text-[#1A0F0A]/50 flex items-center gap-1">
                            <Eye size={12} />
                            {exh.viewsCount || 0} visits
                          </span>
                        </div>

                        <h4 className="font-serif text-xl font-semibold text-[#1A0F0A]">
                          {exh.title}
                        </h4>

                        {exh.subtitle && (
                          <p className="text-xs font-sans text-[#1A0F0A]/70 line-clamp-2 leading-relaxed">
                            {exh.subtitle}
                          </p>
                        )}

                        <div className="pt-2 text-xs font-sans text-[#1A0F0A]/60 flex items-center gap-1.5">
                          <Layers size={13} className="text-[#702D35]" />
                          <span>{exh.artworks?.length || 0} Artworks Curated</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-[#E7DDD0]/60 mt-4 flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/exhibitions/${exh.slug}`}
                          target="_blank"
                          className="text-[#702D35] font-semibold hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={13} />
                          Visit Pavilion
                        </Link>

                        <button
                          onClick={() => handleCopyLink(exh.slug)}
                          className="text-[#1A0F0A]/50 hover:text-[#1A0F0A] p-1"
                          title="Copy Link"
                        >
                          {copiedSlug === exh.slug ? (
                            <Check size={14} className="text-emerald-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => handleDeleteExhibition(exh.id)}
                        className="text-[#1A0F0A]/40 hover:text-rose-600 transition-colors p-1"
                        title="Delete Exhibition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
