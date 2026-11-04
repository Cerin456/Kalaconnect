'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight, Search } from 'lucide-react';

interface ArtistItem {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  craft: string;
  category: string;
  location: string;
  experience: string;
  badge: string;
  avatarUrl: string;
}

const categories = ['All', 'Madhubani', 'Blue Pottery', 'Warli', 'Handloom', 'Kutch Embroidery'];

export default function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArtists();
  }, [selectedCategory, searchQuery]);

  const fetchArtists = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`/api/artists?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.artists) {
        setArtists(data.artists);
      }
    } catch (err) {
      console.error('Failed to load artists:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#FAF6EF] min-h-screen">
      <Navbar />

      <div className="pt-10 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="space-y-4 mb-12">
            <div className="section-label">Our Master Artisans</div>
            <h1 className="font-serif text-5xl sm:text-6xl font-medium text-[#1A0F0A]">
              Explore Traditional{' '}
              <em className="text-[#582128] font-serif italic font-normal">Artists</em>
            </h1>
            <p className="font-sans text-base text-[#1A0F0A]/70 max-w-xl leading-relaxed">
              Discover verified master artisans preserving centuries of India&apos;s living cultural
              heritage. View their digital portfolios and send direct enquiries.
            </p>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="space-y-5 mb-12">
            <div className="relative max-w-lg">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A0F0A]/40"
              />
              <input
                type="text"
                placeholder="Search by artist name, craft, or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E7DDD0] rounded-xl pl-11 pr-4 py-3 text-sm font-sans focus:outline-none focus:border-[#702D35] transition-colors shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-sans font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#702D35] text-white shadow-sm'
                      : 'bg-white text-[#1A0F0A]/70 border border-[#E7DDD0] hover:border-[#702D35] hover:text-[#702D35]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-[#702D35] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-sans text-sm text-[#702D35]">Searching artisan community...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.slug}`}
                  className="group block rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  {/* Arch Photo from Prototype */}
                  <div className="relative w-full aspect-[257/361] overflow-hidden rounded-t-[40px] bg-[#F0E7DC]">
                    <Image
                      src={artist.avatarUrl || '/images/artist_meera.png'}
                      alt={`${artist.firstName} ${artist.lastName} - ${artist.craft}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Info Card */}
                  <div className="bg-white p-6 rounded-b-2xl border border-t-0 border-[#E7DDD0]/70 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A] group-hover:text-[#702D35] transition-colors">
                          {artist.firstName} {artist.lastName}
                        </h3>
                        <p className="font-sans text-sm font-semibold text-[#C4522A] mt-1">
                          {artist.craft}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-[#702D35]/30 flex items-center justify-center group-hover:bg-[#702D35] group-hover:border-[#702D35] transition-all flex-shrink-0 mt-0.5">
                        <ArrowRight
                          size={15}
                          className="text-[#702D35] group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-4 text-xs font-sans text-[#1A0F0A]/55 font-medium">
                      <MapPin size={13} className="text-[#1A0F0A]/40 flex-shrink-0" />
                      <span>{artist.location}</span>
                      <span className="mx-1.5 opacity-50">&bull;</span>
                      <span>{artist.experience}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loading && artists.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E7DDD0]">
              <p className="font-serif text-2xl text-[#1A0F0A]/60">
                No artists found matching your criteria.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="mt-4 text-sm font-sans font-semibold text-[#702D35] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
