'use client';

import { use, useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EnquiryModal from '@/components/EnquiryModal';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Award, Calendar, Sparkles, Send, ArrowLeft, ShieldCheck, Share2 } from 'lucide-react';

interface ArtistData {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  craft: string;
  location: string;
  experience: string;
  badge: string;
  avatarUrl: string;
  story: string;
  tradition: string;
}

interface ArtworkData {
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

interface JourneyRef {
  id: string;
  artworkId: string;
  title: string;
}

export default function ArtistDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [journeys, setJourneys] = useState<JourneyRef[]>([]);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchArtist();
  }, [slug]);

  const fetchArtist = async () => {
    try {
      const res = await fetch(`/api/artists/${slug}`);
      const data = await res.json();
      if (data.success && data.artist) {
        setArtist(data.artist);
        setArtworks(data.artworks || []);
        setJourneys(data.journeys || []);
      }
    } catch (err) {
      console.error('Failed to load artist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#FAF6EF] min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="w-12 h-12 border-3 border-[#702D35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-xl text-[#702D35]">Loading Master Artisan Portfolio...</p>
        </div>
      </main>
    );
  }

  if (!artist) {
    return (
      <main className="bg-[#FAF6EF] min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
          <h2 className="font-serif text-3xl font-semibold text-[#1A0F0A]">Artisan Not Found</h2>
          <p className="font-sans text-sm text-[#1A0F0A]/60">
            The artist portfolio you are looking for is unavailable or has been relocated.
          </p>
          <Link
            href="/artists"
            className="inline-block bg-[#702D35] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#582128]"
          >
            Explore Other Artists
          </Link>
        </div>
      </main>
    );
  }

  const fullName = `${artist.firstName} ${artist.lastName}`;

  return (
    <main className="bg-[#FAF6EF] min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        {/* Breadcrumb Back Link */}
        <div className="mb-8">
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-[#702D35] hover:text-[#582128] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to All Artists
          </Link>
        </div>

        {/* Artist Profile Header Hero */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
          {/* Main Arch Portrait */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[257/361] rounded-t-[50px] rounded-b-2xl overflow-hidden shadow-xl border border-[#E7DDD0] bg-[#F0E7DC]">
              <Image
                src={artist.avatarUrl || '/images/artist_meera.png'}
                alt={fullName}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Artist Bio & Credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#F0E7DC] text-[#702D35] px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold uppercase tracking-wider border border-[#E7DDD0]">
                <ShieldCheck size={14} />
                {artist.badge || 'Verified Artisan'}
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl font-medium text-[#1A0F0A]">
                {fullName}
              </h1>

              <div className="text-xl font-sans font-semibold text-[#C4522A]">
                {artist.craft}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 py-2 border-y border-[#E7DDD0] text-sm font-sans text-[#1A0F0A]/70">
              <div className="flex items-center gap-1.5">
                <MapPin size={16} className="text-[#C4522A]" />
                <span>{artist.location}</span>
              </div>
              <span className="opacity-40">&bull;</span>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-[#C4522A]" />
                <span>{artist.experience} Experience</span>
              </div>
              <span className="opacity-40">&bull;</span>
              <div className="flex items-center gap-1.5">
                <Award size={16} className="text-[#C4522A]" />
                <span>100% Verified Lineage</span>
              </div>
            </div>

            {/* Narrative Story */}
            <div className="space-y-3">
              <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A]">
                Artistic Journey &amp; Tradition
              </h3>
              <p className="font-sans text-base text-[#1A0F0A]/75 leading-relaxed">
                {artist.story}
              </p>
            </div>

            {/* Heritage Info Card */}
            {artist.tradition && (
              <div className="bg-white rounded-2xl p-5 border border-[#E7DDD0] space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#702D35]">
                  <Sparkles size={14} />
                  About The Craft
                </div>
                <p className="font-sans text-sm text-[#1A0F0A]/70 leading-relaxed">
                  {artist.tradition}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="bg-[#702D35] text-white px-8 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#582128] transition-all flex items-center gap-2 shadow-md"
              >
                <Send size={16} />
                Send Purchase or Commission Enquiry
              </button>

              <button
                onClick={handleShare}
                className="border border-[#E7DDD0] bg-white text-[#1A0F0A]/80 px-5 py-3.5 rounded-lg font-sans font-semibold text-sm hover:border-[#702D35] hover:text-[#702D35] transition-all flex items-center gap-2"
              >
                <Share2 size={16} />
                {copied ? 'Link Copied!' : 'Share Portfolio'}
              </button>
            </div>
          </div>
        </div>

        {/* Selected Artworks Gallery */}
        <div className="space-y-8 pt-8 border-t border-[#E7DDD0]">
          <div className="space-y-2">
            <div className="section-label">Masterpieces</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#1A0F0A]">
              Featured Creations by {fullName} ({artworks.length})
            </h2>
          </div>

          {artworks.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-[#E7DDD0] text-sm text-[#1A0F0A]/60">
              No artworks published in this portfolio yet. Check back soon!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((work) => (
                <div
                  key={work.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E7DDD0] shadow-sm group hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="relative w-full aspect-[4/3] bg-[#F0E7DC]">
                      <Image
                        src={work.imageUrl}
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xl font-semibold text-[#1A0F0A]">
                          {work.title}
                        </h4>
                        {work.price && (
                          <span className="text-xs font-sans font-bold text-[#702D35] bg-[#FAF6EF] px-2.5 py-1 rounded-full border border-[#E7DDD0]">
                            {work.price}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-[#1A0F0A]/60">
                        {work.medium} {work.year ? `• ${work.year}` : ''}
                      </p>
                      {work.description && (
                        <p className="font-sans text-xs text-[#1A0F0A]/75 line-clamp-3 leading-relaxed pt-1">
                          {work.description}
                        </p>
                      )}

                      {/* Creative Journey Link if available */}
                      {(() => {
                        const matchingJourney = journeys.find((j) => j.artworkId === work.id);
                        if (!matchingJourney) return null;
                        return (
                          <div className="pt-2">
                            <Link
                              href={`/journey/${matchingJourney.id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#C4522A] bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors shadow-xs"
                            >
                              <Sparkles size={13} className="text-[#C9A060]" />
                              Explore the Creative Journey &rarr;
                            </Link>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[#E7DDD0]/60 mt-4 flex items-center justify-between">
                    <button
                      onClick={() => setEnquiryOpen(true)}
                      className="text-xs font-sans font-semibold text-[#702D35] hover:text-[#582128] flex items-center gap-1.5 pt-3"
                    >
                      Enquire about this piece &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Direct Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        artistId={artist.id}
        artistName={fullName}
        artform={artist.craft}
      />
    </main>
  );
}
