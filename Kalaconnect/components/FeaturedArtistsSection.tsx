'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

const featuredArtists = [
  {
    slug: 'meera-devi',
    name: 'Meera Devi',
    craft: 'Madhubani Painter',
    location: 'Madhubani, Bihar',
    experience: '18 years',
    image: '/images/artist_meera.png',
  },
  {
    slug: 'ramesh-kumar',
    name: 'Ramesh Kumar',
    craft: 'Blue Pottery Artisan',
    location: 'Jaipur, Rajasthan',
    experience: '24 years',
    image: '/images/artist_ramesh.png',
  },
  {
    slug: 'lalita-ben',
    name: 'Lalita Ben',
    craft: 'Kutch Embroidery',
    location: 'Bhuj, Gujarat',
    experience: '15 years',
    image: '/images/artist_lalita.png',
  },
];

export default function FeaturedArtistsSection() {
  return (
    <section className="bg-[#F0E7DC] py-24 overflow-hidden border-t border-[#E7DDD0]/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <div className="section-label">Voices of our heritage</div>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#1A0F0A]">
            Meet the hands behind the{' '}
            <em className="text-[#582128] font-serif italic font-normal">art</em>
          </h2>
          <p className="font-sans text-base text-[#1A0F0A]/70 leading-relaxed">
            Discover master artisans preserving centuries-old traditions, one
            creation at a time.
          </p>
        </div>

        {/* 3 Featured Artist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArtists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="group block rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Exact Arch Image with Badges from Figma */}
              <div className="relative w-full aspect-[257/361] drop-shadow-sm overflow-hidden rounded-t-[40px]">
                <Image
                  src={artist.image}
                  alt={`${artist.name} - ${artist.craft}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* White Information Card */}
              <div className="bg-white p-6 rounded-b-2xl border-t-0 shadow-sm border border-[#E7DDD0]/60">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-[#1A0F0A] group-hover:text-[#702D35] transition-colors">
                      {artist.name}
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
      </div>
    </section>
  );
}
