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
  Eye,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  QrCode,
  Tag,
  Award,
} from 'lucide-react';
import { generateQRCodeSVG } from '@/lib/qrcode';

interface PopulatedArtwork {
  id: string;
  title: string;
  craft: string;
  medium: string;
  year?: string;
  price?: string;
  dimensions?: string;
  imageUrl: string;
  description: string;
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
  viewsCount: number;
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

export default function PublicExhibitionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [loading, setLoading] = useState(true);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<PopulatedArtwork[]>([]);
  const [activeArtworkIdx, setActiveArtworkIdx] = useState(0);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryTargetArt, setEnquiryTargetArt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrSVG, setQrSVG] = useState('');

  useEffect(() => {
    fetchExhibition();
    if (typeof window !== 'undefined') {
      const svg = generateQRCodeSVG(window.location.href, 200, '#702D35', '#FAF6EF');
      setQrSVG(svg);
    }
  }, [slug]);

  const fetchExhibition = async () => {
    try {
      const res = await fetch(`/api/exhibitions/${slug}`);
      const data = await res.json();
      if (data.success && data.exhibition) {
        setExhibition(data.exhibition);
        setArtist(data.artist);
        setArtworks(data.artworks || []);
      }
    } catch (err) {
      console.error('Failed to load exhibition:', err);
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

  const handleWhatsAppShare = () => {
    const text = `Explore "${exhibition?.title}", a virtual art exhibition curated on KalaConnect: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) {
    return (
      <main className="bg-[#FAF6EF] min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <div className="w-12 h-12 border-3 border-[#702D35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xl text-[#702D35]">Entering Virtual Exhibition Pavilion...</p>
        </div>
      </main>
    );
  }

  if (!exhibition) {
    return (
      <main className="bg-[#FAF6EF] min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center space-y-4">
          <h2 className="font-serif text-3xl font-semibold text-[#1A0F0A]">Exhibition Not Found</h2>
          <p className="font-sans text-sm text-[#1A0F0A]/60">
            This digital exhibition pavilion may be currently unlisted or undergoing private installation.
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
  const currentWork = artworks[activeArtworkIdx] || artworks[0];

  return (
    <main className="bg-[#FAF6EF] min-h-screen">
      <Navbar />

      <div className="pt-8 pb-24 max-w-6xl mx-auto px-6 space-y-12">
        {/* Top bar */}
        <div className="flex flex-wrap justify-between items-center gap-4">
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="border border-emerald-600/40 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle size={14} className="text-emerald-700" />
              WhatsApp Share
            </button>

            <button
              onClick={handleShare}
              className="border border-[#E7DDD0] bg-white text-[#1A0F0A]/80 px-3.5 py-1.5 rounded-lg text-xs font-sans font-semibold hover:border-[#702D35] hover:text-[#702D35] flex items-center gap-1.5 transition-colors"
            >
              <Share2 size={13} />
              {copied ? 'Link Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        {/* Exhibition Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#E7DDD0] shadow-md bg-[#1A0F0A] text-white">
          <div className="relative h-80 sm:h-96 w-full opacity-40">
            <Image
              src={exhibition.coverImage || '/images/hero_collage.png'}
              alt={exhibition.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#1A0F0A] via-[#1A0F0A]/60 to-transparent p-6 sm:p-12 flex flex-col justify-end space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#702D35] text-white text-[11px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {exhibition.theme}
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Calendar size={12} />
                {exhibition.startDate} {exhibition.endDate ? `to ${exhibition.endDate}` : '(Permanent Exhibition)'}
              </span>
              <span className="text-white/60 text-xs flex items-center gap-1 ml-auto">
                <Eye size={13} />
                {exhibition.viewsCount || 0} visits
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-medium leading-tight text-[#FAF6EF]">
              {exhibition.title}
            </h1>

            {exhibition.subtitle && (
              <p className="font-sans text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
                {exhibition.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Curator Narrative */}
        <div className="bg-white border border-[#E7DDD0] rounded-3xl p-8 sm:p-10 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#702D35]">
            <Sparkles size={14} className="text-[#C9A060]" />
            Curatorial Statement
          </div>
          <p className="font-sans text-sm sm:text-base text-[#1A0F0A]/80 leading-relaxed">
            {exhibition.description}
          </p>
        </div>

        {/* Interactive Virtual Gallery Pavilion */}
        {artworks.length > 0 && currentWork && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="section-label">Exhibition Room {activeArtworkIdx + 1} of {artworks.length}</div>
                <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
                  {currentWork.title}
                </h3>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveArtworkIdx((prev) => (prev > 0 ? prev - 1 : artworks.length - 1))}
                  className="p-2.5 rounded-full border border-[#E7DDD0] bg-white hover:bg-[#FAF6EF] transition-colors"
                  aria-label="Previous artwork"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-sans text-[#1A0F0A]/60 px-2">
                  {activeArtworkIdx + 1} / {artworks.length}
                </span>
                <button
                  onClick={() => setActiveArtworkIdx((prev) => (prev < artworks.length - 1 ? prev + 1 : 0))}
                  className="p-2.5 rounded-full border border-[#E7DDD0] bg-white hover:bg-[#FAF6EF] transition-colors"
                  aria-label="Next artwork"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Spotlight Showcase Frame */}
            <div className="bg-white border border-[#E7DDD0] rounded-3xl p-6 sm:p-10 shadow-sm grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F0E7DC] shadow-md border-4 border-white">
                  <Image
                    src={currentWork.imageUrl}
                    alt={currentWork.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="md:col-span-5 space-y-4">
                <div>
                  <div className="text-xs font-sans uppercase font-bold text-[#C4522A]">
                    {currentWork.craft}
                  </div>
                  <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1A0F0A] mt-1">
                    {currentWork.title}
                  </h4>
                  {currentWork.price && (
                    <div className="font-sans text-sm font-bold text-[#702D35] bg-[#FAF6EF] inline-block px-3 py-1 rounded-full border border-[#E7DDD0] mt-2">
                      {currentWork.price}
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs font-sans text-[#1A0F0A]/70 border-y border-[#E7DDD0]/60 py-3">
                  <div><strong>Medium:</strong> {currentWork.medium}</div>
                  {currentWork.dimensions && <div><strong>Dimensions:</strong> {currentWork.dimensions}</div>}
                  {currentWork.year && <div><strong>Creation Year:</strong> {currentWork.year}</div>}
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#1A0F0A]/80 leading-relaxed">
                  {currentWork.customDescription || currentWork.description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setEnquiryTargetArt(currentWork.title);
                      setEnquiryOpen(true);
                    }}
                    className="w-full bg-[#702D35] text-white py-3 rounded-xl text-xs font-sans font-semibold hover:bg-[#582128] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send size={14} />
                    Enquire to Acquire this Piece
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigator */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {artworks.map((work, idx) => (
                <div
                  key={work.id}
                  onClick={() => setActiveArtworkIdx(idx)}
                  className={`relative w-24 h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                    activeArtworkIdx === idx
                      ? 'border-[#702D35] ring-2 ring-[#702D35]/30'
                      : 'border-[#E7DDD0] opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={work.imageUrl} alt={work.title} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artist Profile Card */}
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
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#C4522A]">
                  Exhibiting Master Artist
                </span>
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
                View Full Artist Portfolio
              </Link>
              <button
                onClick={() => {
                  setEnquiryTargetArt(exhibition.title);
                  setEnquiryOpen(true);
                }}
                className="bg-[#702D35] text-white px-6 py-3 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128] transition-colors flex items-center gap-2 shadow-sm"
              >
                <Send size={14} />
                Send Exhibition Enquiry
              </button>
            </div>
          </div>
        )}

        {/* QR Code Presentation Box */}
        <div className="bg-[#FAF6EF] border border-[#E7DDD0] rounded-3xl p-8 text-center space-y-4">
          <h4 className="font-serif text-xl font-semibold text-[#1A0F0A]">
            Official Exhibition QR Access
          </h4>
          <p className="font-sans text-xs text-[#1A0F0A]/60 max-w-sm mx-auto">
            Scan this QR code with any mobile device to enter this virtual exhibition pavilion directly.
          </p>
          {qrSVG && (
            <div
              className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-[#E7DDD0]"
              dangerouslySetInnerHTML={{ __html: qrSVG }}
            />
          )}
          <div>
            <button
              onClick={() => window.print()}
              className="bg-[#FAF6EF] text-[#702D35] border border-[#702D35] px-5 py-2 rounded-lg text-xs font-semibold hover:bg-[#702D35] hover:text-white transition-colors"
            >
              Print Exhibition Signboard
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        artistId={artist?.id || 'artist-1'}
        artistName={artistName}
        artform={`${exhibition.theme} (${enquiryTargetArt || exhibition.title})`}
      />
    </main>
  );
}
