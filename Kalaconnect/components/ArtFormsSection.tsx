'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const artForms = [
  {
    name: 'Madhubani',
    region: 'Bihar',
    image: '/images/art_madhubani.png',
    href: '/artists?artform=Madhubani',
    aspect: 'aspect-[227/323]',
  },
  {
    name: 'Blue Pottery',
    region: 'Rajasthan',
    image: '/images/art_blue_pottery.png',
    href: '/artists?artform=Blue+Pottery',
    aspect: 'aspect-[159/324]',
  },
  {
    name: 'Warli',
    region: 'Maharashtra',
    image: '/images/art_warli.png',
    href: '/artists?artform=Warli',
    aspect: 'aspect-[159/324]',
  },
  {
    name: 'Handloom',
    region: 'Across India',
    image: '/images/art_handloom.png',
    href: '/artists?artform=Handloom',
    aspect: 'aspect-[228/359]',
  },
];

export default function ArtFormsSection() {
  return (
    <section className="bg-[#FAF6EF] pb-24 overflow-hidden">
      {/* Textile ribbon border from Figma */}
      <div className="w-full relative h-3 mb-16 overflow-hidden">
        <Image
          src="/images/textile_ribbon.png"
          alt="Traditional textile pattern motif"
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <div className="section-label">Explore the living heritage</div>
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#1A0F0A]">
              Art forms with a{' '}
              <em className="text-[#582128] font-serif italic font-normal">story</em>
            </h2>
          </div>
          <Link
            href="/artists"
            className="flex items-center gap-2 text-[#702D35] font-sans text-sm font-semibold hover:gap-3 transition-all"
          >
            View all categories
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* 4 Art Form Cards from Figma Prototype */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 lg:gap-6 items-end">
          {artForms.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group block relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className={`relative w-full ${item.aspect} drop-shadow-sm`}>
                <Image
                  src={item.image}
                  alt={`${item.name} from ${item.region}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain object-bottom group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
