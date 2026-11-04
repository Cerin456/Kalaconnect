'use client';

import { use, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  Send,
  Share2,
  CheckCircle2,
  Compass,
  MapPin,
  Award,
  Clock,
  QrCode,
  Tag,
} from 'lucide-react';
import { generateQRCodeSVG } from '@/lib/qrcode';

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

interface Artist {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  craft: string;
  location: string;
  experience: string;
  avatarUrl: string;
  story: string;
  badge: string;
}

interface Artwork {
  id: string;
  title: string;
  craft: string;
  medium: string;
  price?: string;
  imageUrl: string;
}

export default function PublicJourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const journeyId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [journey, setJourney] = useState<CreativeJourney | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrSVG, setQrSVG] = useState('');

  useEffect(() => {
    fetchJourney();
    if (typeof window !== 'undefined') {
      const svg = generateQRCodeSVG(window.location.href, 180, '#702D35', '#FAF6EF');
      setQrSVG(svg);
    }
  }, [journeyId]);

  const fetchJourney = async () => {
    try {
      const res = await fetch(`/api/journeys/${journeyId}`);
      const data = await res.json();
      if (data.success && data.journey) {
        setJourney(data.journey);
        setArtist(data.artist);
        setArtwork(data.artwork);
      }
    } catch (err) {
      console.error('Failed to load journey:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#FAF6EF] min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="w-12 h-12 border-3 border-[#702D35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xl text-[#702D35]">Unfolding the Creative Journey...</p>
        </div>
      </main>
    );
  }

  if (!journey) {
    return (
      <main className="bg-[#FAF6EF] min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4">
          <h2 className="font-serif text-3xl font-semibold text-[#1A0F0A]">Creative Journey Unavailable</h2>
          <p className="font-sans text-sm text-[#1A0F0A]/60">
            This creation chronicle may be private, unlisted, or still in preparation by the artisan.
          </p>
          <Link
            href="/artists"
            className="inline-block bg-[#702D35] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#582128]"
          >
            Explore Master Artisans
          </Link>
        </div>
      </main>
    );
  }

  const artistName = artist ? `${artist.firstName} ${artist.lastName}` : 'Master Artisan';
  const firstStage = journey.stages?.[0];
  const lastStage = journey.stages?.[journey.stages.length - 1];

  return (
    <main className="bg-[#FAF6EF] min-h-screen">
      <Navbar />

      <div className="pt-10 pb-24 max-w-5xl mx-auto px-6 space-y-12">
        {/* Back navigation & Share */}
        <div className="flex justify-between items-center">
          {artist ? (
            <Link
              href={`/artists/${artist.slug}`}
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#702D35] hover:text-[#582128]"
            >
              <ArrowLeft size={14} />
              Back to {artistName}&apos;s Portfolio
            </Link>
          ) : (
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[#702D35] hover:text-[#582128]"
            >
              <ArrowLeft size={14} />
              Explore All Artisans
            </Link>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="border border-[#E7DDD0] bg-white text-[#1A0F0A]/80 px-4 py-2 rounded-lg font-sans font-semibold text-xs hover:border-[#702D35] hover:text-[#702D35] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 size={13} />
              {copied ? 'Link Copied!' : 'Share Journey'}
            </button>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white border border-[#E7DDD0] rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="section-label">Creation Chronicle</span>
            <span className="text-xs font-sans text-[#1A0F0A]/50">&bull;</span>
            <span className="text-xs font-sans font-semibold text-[#C4522A]">
              {artwork?.craft || artist?.craft || 'Traditional Indian Craft'}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-[#1A0F0A] leading-tight">
            {journey.title}
          </h1>

          {journey.introduction && (
            <p className="font-sans text-base sm:text-lg text-[#1A0F0A]/75 leading-relaxed max-w-3xl">
              {journey.introduction}
            </p>
          )}

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#E7DDD0]/70 text-xs font-sans text-[#1A0F0A]/70">
            <div className="flex items-center gap-1.5">
              <Layers size={15} className="text-[#702D35]" />
              <span><strong>{journey.stages?.length || 0}</strong> Creation Stages</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center gap-1.5">
              <Sparkles size={15} className="text-[#C9A060]" />
              <span>Handcrafted by <strong>{artistName}</strong></span>
            </div>
            {artwork?.price && (
              <>
                <span>&bull;</span>
                <div className="flex items-center gap-1.5">
                  <Tag size={15} className="text-[#C4522A]" />
                  <span>Artwork Valuation: <strong>{artwork.price}</strong></span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Before and After Comparison (Inception vs Completion) */}
        {firstStage && lastStage && journey.stages.length > 1 && (
          <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-3xl p-8 space-y-4">
            <div className="space-y-1">
              <div className="section-label">Transformation Arc</div>
              <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                From Raw Inception to Finished Masterpiece
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-2">
              <div className="bg-white rounded-2xl p-4 border border-[#E7DDD0] space-y-3 shadow-sm">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C4522A] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  Initial Stage: {firstStage.stageTitle}
                </span>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F0E7DC]">
                  <Image src={firstStage.mediaUrl} alt="Initial Concept" fill className="object-cover" />
                </div>
                <p className="text-xs font-sans text-[#1A0F0A]/70 line-clamp-2">
                  {firstStage.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#E7DDD0] space-y-3 shadow-sm">
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Completed Work: {lastStage.stageTitle}
                </span>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F0E7DC]">
                  <Image src={lastStage.mediaUrl} alt="Final Masterpiece" fill className="object-cover" />
                </div>
                <p className="text-xs font-sans text-[#1A0F0A]/70 line-clamp-2">
                  {lastStage.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Full Creation Story */}
        {journey.fullStory && (
          <div className="bg-white border border-[#E7DDD0] rounded-3xl p-8 sm:p-10 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#702D35]">
              <Sparkles size={14} className="text-[#C9A060]" />
              The Artisan Narrative
            </div>
            <p className="font-sans text-sm sm:text-base text-[#1A0F0A]/80 leading-relaxed">
              {journey.fullStory}
            </p>
          </div>
        )}

        {/* Interactive Chronological Timeline */}
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="section-label">Step-by-Step Chronology</div>
            <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
              The Creation Milestones
            </h3>
            <p className="font-sans text-xs text-[#1A0F0A]/60">
              Follow the unbroken rhythm of traditional craft from initial meditation to final flourish.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-10 border-l-2 border-[#702D35]/30 space-y-10 py-4">
            {journey.stages.map((stage, idx) => (
              <div key={stage.id || idx} className="relative space-y-3">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-8 h-8 rounded-full bg-[#702D35] text-[#FAF6EF] flex items-center justify-center font-sans font-bold text-xs shadow-md border-2 border-white">
                  {idx + 1}
                </div>

                <div className="bg-white border border-[#E7DDD0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E7DDD0]/60 pb-3">
                    <h4 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                      {stage.stageTitle}
                    </h4>
                    {stage.stageDate && (
                      <span className="text-xs font-sans text-[#1A0F0A]/50 flex items-center gap-1">
                        <Calendar size={13} />
                        {stage.stageDate}
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F0E7DC] shadow-inner">
                        <Image
                          src={stage.mediaUrl || '/images/hero_collage.png'}
                          alt={stage.stageTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <p className="font-sans text-sm text-[#1A0F0A]/80 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Artisan Card & Direct Action */}
        {artist && (
          <div className="bg-white border border-[#E7DDD0] rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#702D35] shrink-0">
                <Image
                  src={artist.avatarUrl || '/images/artist_meera.png'}
                  alt={artistName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C4522A]">
                  Verified Lineage
                </div>
                <h4 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                  {artistName}
                </h4>
                <div className="text-xs font-sans text-[#1A0F0A]/60 flex items-center gap-2">
                  <MapPin size={13} className="text-[#702D35]" />
                  <span>{artist.location} &bull; {artist.experience}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/artists/${artist.slug}`}
                className="border border-[#702D35] text-[#702D35] px-6 py-3 rounded-lg text-xs font-sans font-semibold hover:bg-[#702D35] hover:text-white transition-colors"
              >
                View Full Portfolio
              </Link>
              <button
                onClick={() => setEnquiryOpen(true)}
                className="bg-[#702D35] text-white px-6 py-3 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send size={14} />
                Commission or Purchase Piece
              </button>
            </div>
          </div>
        )}

        {/* QR Code Presentation Box */}
        <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-3xl p-8 text-center space-y-4">
          <h4 className="font-serif text-xl font-semibold text-[#1A0F0A]">
            Scan at Art Exhibitions &amp; Galleries
          </h4>
          <p className="font-sans text-xs text-[#1A0F0A]/60 max-w-sm mx-auto">
            Scan this QR code with any smartphone to open this step-by-step creation chronicle in real time.
          </p>
          {qrSVG && (
            <div
              className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-[#E7DDD0]"
              dangerouslySetInnerHTML={{ __html: qrSVG }}
            />
          )}
        </div>
      </div>

      <Footer />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        artistId={artist?.id || 'artist-1'}
        artistName={artistName}
        artform={artwork?.craft || artist?.craft || 'Traditional Artwork'}
      />
    </main>
  );
}
