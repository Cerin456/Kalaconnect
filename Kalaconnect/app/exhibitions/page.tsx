'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Eye,
  MapPin,
  Palette,
  Search,
} from 'lucide-react';

interface ExhibitionItem {
  id: string;
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
  artworks: any[];
  artistName?: string;
  artistCraft?: string;
  artistAvatar?: string;
  artistSlug?: string;
}

const THEME_FILTERS = [
  'All',
  'Traditional Indian Art',
  'Kerala Heritage',
  'Contemporary Folk Art',
  'Women in Traditional Art',
  'Nature and Culture',
  'Festival Special',
];

export default function ExhibitionsDirectoryPage() {
  const [exhibitions, setExhibitions] = useState<ExhibitionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchExhibitions();
  }, []);

  const fetchExhibitions = async () => {
    try {
      const res = await fetch('/api/exhibitions?public=true');
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

  const filtered = exhibitions.filter((exh) => {
    const matchesTheme =
      selectedTheme === 'All' || exh.theme.toLowerCase() === selectedTheme.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      exh.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exh.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exh.artistName && exh.artistName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exh.description && exh.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTheme && matchesSearch;
  });

  return (
    <main className="bg-[#FAF6EF] min-h-screen">
      <Navbar />

      <div className="pt-10 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header */}
          <div className="space-y-4 max-w-2xl">
            <div className="section-label">Digital Heritage Pavilions</div>
            <h1 className="font-serif text-5xl sm:text-6xl font-medium text-[#1A0F0A]">
              Virtual Art{' '}
              <em className="text-[#582128] font-serif italic font-normal">Exhibitions</em>
            </h1>
            <p className="font-sans text-base text-[#1A0F0A]/70 leading-relaxed">
              Step inside curated digital pavilions created directly by India&apos;s master traditional
              artisans. Experience thematic collections, artist narratives, and acquire authentic works.
            </p>
          </div>

          {/* Search Bar & Theme Filter Pills */}
          <div className="space-y-5">
            <div className="relative max-w-lg">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A0F0A]/40"
              />
              <input
                type="text"
                placeholder="Search exhibitions by theme, craft, or master artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E7DDD0] rounded-xl pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:border-[#702D35] transition-colors shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {THEME_FILTERS.map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSelectedTheme(theme)}
                  className={`px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all ${
                    selectedTheme === theme
                      ? 'bg-[#702D35] text-white shadow-sm'
                      : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35] hover:text-[#702D35]'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Exhibitions Grid */}
          {loading ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-10 h-10 border-3 border-[#702D35] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-serif text-lg text-[#702D35]">Loading Virtual Pavilions...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-[#E7DDD0] space-y-4 shadow-sm">
              <Palette size={40} className="text-[#1A0F0A]/30 mx-auto" />
              <h3 className="font-serif text-3xl font-semibold text-[#1A0F0A]">
                No Exhibitions Found
              </h3>
              <p className="font-sans text-sm text-[#1A0F0A]/60 max-w-md mx-auto">
                No active exhibitions match your search filter. Explore other categories or log in to your
                dashboard to curate the first virtual exhibition in this genre.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-block bg-[#702D35] text-white px-6 py-2.5 rounded-lg text-xs font-sans font-semibold hover:bg-[#582128]"
                >
                  Create an Exhibition in Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((exh) => (
                <div
                  key={exh.id}
                  className="bg-white border border-[#E7DDD0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-[#FAF6EF] overflow-hidden">
                      <Image
                        src={exh.coverImage || '/images/hero_collage.png'}
                        alt={exh.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-[#702D35] text-white text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow">
                        {exh.theme}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-sans font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Eye size={12} />
                        {exh.viewsCount || 0} visits
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-sans text-[#1A0F0A]/60">
                        <Calendar size={13} className="text-[#C4522A]" />
                        <span>
                          {exh.startDate} {exh.endDate ? `to ${exh.endDate}` : '(Permanent)'}
                        </span>
                        <span>&bull;</span>
                        <div className="flex items-center gap-1 text-[#702D35] font-semibold">
                          <Layers size={13} />
                          <span>{exh.artworks?.length || 0} Works</span>
                        </div>
                      </div>

                      <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A] group-hover:text-[#702D35] transition-colors leading-snug">
                        {exh.title}
                      </h3>

                      {exh.subtitle && (
                        <p className="font-sans text-xs text-[#1A0F0A]/70 line-clamp-2 leading-relaxed">
                          {exh.subtitle}
                        </p>
                      )}

                      {/* Exhibiting Artist Tag */}
                      {exh.artistName && (
                        <div className="pt-2 flex items-center gap-2.5 border-t border-[#E7DDD0]/60">
                          {exh.artistAvatar && (
                            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#702D35] shrink-0">
                              <Image src={exh.artistAvatar} alt={exh.artistName} fill className="object-cover" />
                            </div>
                          )}
                          <div className="text-xs font-sans">
                            <span className="text-[#1A0F0A]/60">Curated by </span>
                            <span className="font-semibold text-[#1A0F0A]">{exh.artistName}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-[#E7DDD0]/60 mt-2">
                    <Link
                      href={`/exhibitions/${exh.slug}`}
                      className="inline-flex items-center justify-between w-full text-xs font-sans font-semibold text-[#702D35] group-hover:text-[#582128] pt-3 transition-colors"
                    >
                      <span>Enter Virtual Pavilion</span>
                      <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
