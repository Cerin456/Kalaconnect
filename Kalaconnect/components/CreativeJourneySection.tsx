'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Compass,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Upload,
  CheckCircle,
  Eye,
  ExternalLink,
  Share2,
  Calendar,
  Layers,
  Lock,
  Globe,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface Artwork {
  id: string;
  title: string;
  craft: string;
  medium: string;
  imageUrl: string;
}

interface JourneyStage {
  id: string;
  stageTitle: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  stageOrder: number;
  stageDate?: string;
}

interface CreativeJourney {
  id: string;
  artistId: string;
  artworkId: string;
  title: string;
  introduction: string;
  fullStory: string;
  keywords?: string[];
  socialDescription?: string;
  stages: JourneyStage[];
  visibility: 'public' | 'private';
  published: boolean;
  createdAt: string;
}

interface CreativeJourneySectionProps {
  artworks: Artwork[];
  artistCraft: string;
  artistName: string;
}

const DEFAULT_STAGES = [
  {
    stageTitle: 'Inspiration and Concept',
    description: 'Conceiving the spiritual iconography and visual folklore rooted in ancestral memory.',
    mediaUrl: '/images/hero_collage.png',
  },
  {
    stageTitle: 'Material Preparation',
    description: 'Grinding natural mineral stones, soot, and extracting plant resins for pigments.',
    mediaUrl: '/images/art_madhubani.png',
  },
  {
    stageTitle: 'Planning and Sketching',
    description: 'Outlining sacred geometric double-line borders directly onto untreated canvas.',
    mediaUrl: '/images/art_warli.png',
  },
  {
    stageTitle: 'Artwork Creation & Pigment Layering',
    description: 'Applying base washes and filling symbolic colors using fine bamboo reeds.',
    mediaUrl: '/images/story_collage.png',
  },
  {
    stageTitle: 'Final Detailing & Sealing',
    description: 'Adding fine crosshatching, microscopic dots, and final natural sealant.',
    mediaUrl: '/images/art_blue_pottery.png',
  },
];

export default function CreativeJourneySection({
  artworks,
  artistCraft,
  artistName,
}: CreativeJourneySectionProps) {
  const [journeys, setJourneys] = useState<CreativeJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [uploadingStageIdx, setUploadingStageIdx] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [selectedArtworkId, setSelectedArtworkId] = useState('');
  const [journeyTitle, setJourneyTitle] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [socialDescription, setSocialDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [published, setPublished] = useState(true);
  const [stages, setStages] = useState<JourneyStage[]>([]);

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/journeys');
      const data = await res.json();
      if (data.success && data.journeys) {
        setJourneys(data.journeys);
      }
    } catch (err) {
      console.error('Failed to load journeys:', err);
    } finally {
      setLoading(false);
    }
  };

  const startNewJourney = () => {
    if (artworks.length === 0) {
      setErrorMsg('Please upload at least one artwork to your portfolio first before creating a journey.');
      return;
    }
    const firstArt = artworks[0];
    setSelectedArtworkId(firstArt.id);
    setJourneyTitle(`The Living Genesis of ${firstArt.title}`);
    setIntroduction(
      `An intimate documentation of how ${firstArt.title} was handcrafted using centuries-old ${firstArt.craft} traditions.`
    );
    setFullStory('');
    setVisibility('public');
    setPublished(true);
    setStages(
      DEFAULT_STAGES.map((s, idx) => ({
        id: `stage-${Date.now()}-${idx}`,
        stageTitle: s.stageTitle,
        description: s.description,
        mediaUrl: s.mediaUrl,
        mediaType: 'image',
        stageOrder: idx,
        stageDate: new Date().toISOString().split('T')[0],
      }))
    );
    setIsCreating(true);
    setErrorMsg('');
  };

  const handleArtworkChange = (artId: string) => {
    setSelectedArtworkId(artId);
    const work = artworks.find((w) => w.id === artId);
    if (work) {
      setJourneyTitle(`The Living Genesis of ${work.title}`);
      setIntroduction(
        `An intimate documentation of how ${work.title} was handcrafted using centuries-old ${work.craft} traditions.`
      );
    }
  };

  const handleAddStage = () => {
    const newStage: JourneyStage = {
      id: `stage-${Date.now()}-${stages.length}`,
      stageTitle: `Stage ${stages.length + 1}: Custom Milestone`,
      description: '',
      mediaUrl: '/images/hero_collage.png',
      mediaType: 'image',
      stageOrder: stages.length,
      stageDate: new Date().toISOString().split('T')[0],
    };
    setStages([...stages, newStage]);
  };

  const handleDeleteStage = (index: number) => {
    if (stages.length <= 1) {
      alert('A creative journey needs at least one stage.');
      return;
    }
    const updated = stages.filter((_, idx) => idx !== index);
    setStages(updated.map((s, idx) => ({ ...s, stageOrder: idx })));
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= stages.length) return;
    const reordered = [...stages];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setStages(reordered.map((s, idx) => ({ ...s, stageOrder: idx })));
  };

  const handleStageFileUpload = async (stageIndex: number, file: File) => {
    setUploadingStageIdx(stageIndex);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/journeys/upload-media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const updated = [...stages];
        updated[stageIndex] = {
          ...updated[stageIndex],
          mediaUrl: data.url,
          mediaType: data.mediaType || 'image',
        };
        setStages(updated);
      } else {
        alert(data.error || 'Failed to upload stage media');
      }
    } catch {
      alert('Upload error. Please try again.');
    } finally {
      setUploadingStageIdx(null);
    }
  };

  const handleGenerateStoryAI = async () => {
    const work = artworks.find((w) => w.id === selectedArtworkId);
    setGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/generate-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkTitle: work?.title || 'Masterpiece',
          craft: work?.craft || artistCraft,
          stages: stages.map((s) => ({ stageTitle: s.stageTitle, description: s.description })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.title) setJourneyTitle(data.title);
        if (data.introduction) setIntroduction(data.introduction);
        if (data.fullStory) setFullStory(data.fullStory);
        if (data.keywords) setKeywords(data.keywords);
        if (data.socialDescription) setSocialDescription(data.socialDescription);
      }
    } catch (err) {
      console.error('AI journey error:', err);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArtworkId || !journeyTitle) {
      setErrorMsg('Please select an artwork and provide a journey title.');
      return;
    }

    setSaving(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artworkId: selectedArtworkId,
          title: journeyTitle,
          introduction,
          fullStory,
          keywords,
          socialDescription,
          stages,
          visibility,
          published,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Creative Journey saved successfully!');
        setIsCreating(false);
        fetchJourneys();
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        setErrorMsg(data.error || 'Failed to save journey.');
      }
    } catch {
      setErrorMsg('Network error while saving journey.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJourney = async (id: string) => {
    if (!confirm('Are you sure you want to delete this creative journey?')) return;
    try {
      const res = await fetch(`/api/journeys/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJourneys(journeys.filter((j) => j.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete journey:', err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 section-label mb-2">
            <Compass size={13} />
            Process Transparency
          </div>
          <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
            My Creative Journey
          </h3>
          <p className="font-sans text-xs text-[#1A0F0A]/60 mt-1 max-w-xl">
            Document and reveal the sacred, step-by-step creation of your artworks. Transform progress photos
            into an interactive, chronological story for collectors and patrons.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={startNewJourney}
            className="bg-[#702D35] text-white px-5 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={15} />
            Document New Journey
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

      {/* CREATION / EDITING FORM */}
      {isCreating ? (
        <div className="bg-white border border-[#E7DDD0] rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E7DDD0]/70 pb-4">
            <div>
              <h4 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                Documenting Creative Process
              </h4>
              <p className="text-xs font-sans text-[#1A0F0A]/60 mt-0.5">
                Add milestones, upload stage photos, and write your creation story.
              </p>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-xs font-sans font-semibold text-[#1A0F0A]/60 hover:text-[#1A0F0A] border border-[#E7DDD0] px-3.5 py-1.5 rounded-lg"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveJourney} className="space-y-8">
            {/* Associated Artwork & Title */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#702D35] mb-1.5">
                  Associated Artwork *
                </label>
                <select
                  required
                  value={selectedArtworkId}
                  onChange={(e) => handleArtworkChange(e.target.value)}
                  className="w-full bg-[#FAF6EF] border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                >
                  {artworks.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.craft})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1A0F0A]/70 mb-1.5">
                  Journey Story Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Genesis of Sacred Lotus: 28 Days of Crafting"
                  value={journeyTitle}
                  onChange={(e) => setJourneyTitle(e.target.value)}
                  className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2.5 text-xs font-sans focus:outline-none focus:border-[#702D35]"
                />
              </div>
            </div>

            {/* Introduction & Story with AI Generator */}
            <div className="space-y-4 bg-[#FAF6EF] border border-[#E7DDD0] rounded-2xl p-5">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#702D35]">
                  Introduction &amp; Full Story
                </label>
                <button
                  type="button"
                  onClick={handleGenerateStoryAI}
                  disabled={generatingAI}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#702D35] hover:text-[#582128]"
                >
                  <Sparkles size={13} className="text-[#C9A060]" />
                  {generatingAI ? 'Writing Narrative...' : '✨ Write with AI Assistant'}
                </button>
              </div>

              <textarea
                rows={2}
                placeholder="Short poetic introduction describing your inspiration..."
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35] resize-none"
              />

              <textarea
                rows={3}
                placeholder="Comprehensive narrative of the creation techniques, challenges, and cultural spirit..."
                value={fullStory}
                onChange={(e) => setFullStory(e.target.value)}
                className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3.5 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35] resize-none"
              />
            </div>

            {/* Stages Manager */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-serif text-xl font-semibold text-[#1A0F0A]">
                    Creation Stages &amp; Chronological Milestones ({stages.length})
                  </h5>
                  <p className="text-xs font-sans text-[#1A0F0A]/60">
                    Upload progress photos and record what happened at each phase.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddStage}
                  className="border border-[#702D35] text-[#702D35] bg-[#FAF6EF] px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#702D35] hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  Add Custom Stage
                </button>
              </div>

              <div className="space-y-4">
                {stages.map((stage, idx) => (
                  <div
                    key={stage.id || idx}
                    className="bg-[#FAF6EF]/60 border border-[#E7DDD0] rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E7DDD0]/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#702D35] text-white text-[11px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={stage.stageTitle}
                          onChange={(e) => {
                            const updated = [...stages];
                            updated[idx].stageTitle = e.target.value;
                            setStages(updated);
                          }}
                          className="font-serif text-lg font-semibold text-[#1A0F0A] bg-transparent border-b border-dashed border-[#702D35]/40 focus:border-[#702D35] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveStage(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded text-[#1A0F0A]/50 hover:text-[#1A0F0A] disabled:opacity-30"
                          title="Move earlier"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveStage(idx, 'down')}
                          disabled={idx === stages.length - 1}
                          className="p-1 rounded text-[#1A0F0A]/50 hover:text-[#1A0F0A] disabled:opacity-30"
                          title="Move later"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStage(idx)}
                          className="p-1 rounded text-[#1A0F0A]/50 hover:text-rose-600"
                          title="Delete stage"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-12 gap-4 items-center">
                      {/* Media Preview & Upload */}
                      <div className="sm:col-span-4">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white border border-[#E7DDD0] group">
                          {stage.mediaUrl ? (
                            <Image
                              src={stage.mediaUrl}
                              alt={stage.stageTitle}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full flex items-center justify-center text-xs text-[#1A0F0A]/40">
                              No photo
                            </div>
                          )}

                          <label className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Upload size={18} />
                            <span className="text-[10px] font-sans font-semibold mt-1">
                              {uploadingStageIdx === idx ? 'Uploading...' : 'Replace Photo'}
                            </span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleStageFileUpload(idx, f);
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Description & Date */}
                      <div className="sm:col-span-8 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={stage.stageDate || ''}
                            onChange={(e) => {
                              const updated = [...stages];
                              updated[idx].stageDate = e.target.value;
                              setStages(updated);
                            }}
                            className="bg-white border border-[#E7DDD0] rounded-lg px-2.5 py-1.5 text-xs font-sans text-[#1A0F0A]/70"
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Describe the materials used, techniques applied, or traditional prayers at this stage..."
                          value={stage.description}
                          onChange={(e) => {
                            const updated = [...stages];
                            updated[idx].description = e.target.value;
                            setStages(updated);
                          }}
                          className="w-full bg-white border border-[#E7DDD0] rounded-lg px-3 py-2 text-xs font-sans focus:outline-none focus:border-[#702D35] resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publishing Settings */}
            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#E7DDD0]/70">
              <div className="flex items-center gap-3 bg-[#FAF6EF] p-4 rounded-xl border border-[#E7DDD0]">
                <Globe size={18} className="text-[#702D35]" />
                <div>
                  <div className="text-xs font-bold font-sans text-[#1A0F0A]">Visibility</div>
                  <div className="text-[11px] font-sans text-[#1A0F0A]/60">
                    {visibility === 'public' ? 'Public — Patrons can view on artwork page' : 'Private — Only you can see this'}
                  </div>
                </div>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                  className="ml-auto bg-white border border-[#E7DDD0] rounded-lg px-2.5 py-1 text-xs font-sans"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center gap-3 bg-[#FAF6EF] p-4 rounded-xl border border-[#E7DDD0]">
                <CheckCircle size={18} className="text-emerald-700" />
                <div>
                  <div className="text-xs font-bold font-sans text-[#1A0F0A]">Publish Status</div>
                  <div className="text-[11px] font-sans text-[#1A0F0A]/60">
                    {published ? 'Published to live web portfolio' : 'Saved as draft'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`ml-auto px-3 py-1 rounded-lg text-xs font-sans font-semibold border ${
                    published ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-white text-[#1A0F0A]/70 border-[#E7DDD0]'
                  }`}
                >
                  {published ? 'Published' : 'Draft'}
                </button>
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
                {saving ? 'Publishing Journey...' : 'Save & Publish Creative Journey'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* LIST OF EXISTING JOURNEYS */
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-xs font-sans text-[#1A0F0A]/50">
              Loading creative journeys...
            </div>
          ) : journeys.length === 0 ? (
            <div className="bg-white border border-[#E7DDD0] rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FAF6EF] text-[#702D35] flex items-center justify-center mx-auto border border-[#E7DDD0]">
                <Compass size={28} />
              </div>
              <h4 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                No Creative Journeys Documented Yet
              </h4>
              <p className="font-sans text-xs text-[#1A0F0A]/60 max-w-sm mx-auto leading-relaxed">
                Take patrons behind the scenes. Document your sketch outlines, mineral grinding, and traditional
                brushwork milestones to connect deeply with appreciative collectors.
              </p>
              <button
                onClick={startNewJourney}
                className="bg-[#702D35] text-white px-6 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-all"
              >
                Document Your First Creation Process
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {journeys.map((j) => {
                const associatedWork = artworks.find((w) => w.id === j.artworkId);
                const firstMedia = j.stages?.[0]?.mediaUrl || associatedWork?.imageUrl || '/images/hero_collage.png';

                return (
                  <div
                    key={j.id}
                    className="bg-white border border-[#E7DDD0] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-[#FAF6EF]">
                        <Image
                          src={firstMedia}
                          alt={j.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span
                            className={`text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${
                              j.published
                                ? 'bg-emerald-500 text-white'
                                : 'bg-neutral-800 text-white'
                            }`}
                          >
                            {j.published ? 'Live' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 space-y-2">
                        <div className="text-[11px] font-sans uppercase font-bold text-[#C4522A] flex items-center gap-1.5">
                          <Layers size={13} />
                          {j.stages?.length || 0} Creation Milestones
                        </div>
                        <h4 className="font-serif text-xl font-semibold text-[#1A0F0A]">
                          {j.title}
                        </h4>
                        {j.introduction && (
                          <p className="text-xs font-sans text-[#1A0F0A]/70 line-clamp-2 leading-relaxed">
                            {j.introduction}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-[#E7DDD0]/60 mt-4 flex items-center justify-between text-xs font-sans">
                      <Link
                        href={`/journey/${j.id}`}
                        target="_blank"
                        className="text-[#702D35] font-semibold hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={13} />
                        View Live Timeline
                      </Link>

                      <button
                        onClick={() => handleDeleteJourney(j.id)}
                        className="text-[#1A0F0A]/40 hover:text-rose-600 transition-colors p-1"
                        title="Delete Journey"
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
