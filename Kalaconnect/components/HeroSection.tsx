'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-[#FAF6EF] pt-6 pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Typography & Content */}
        <div className="lg:col-span-6 space-y-7 pt-4">
          {/* Subtitle tag */}
          <div className="section-label">
            Technology that honours tradition
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight text-[#1A0F0A] leading-[1.05]">
            Every Artist<br />
            Deserves to<br />
            <em className="text-maroon font-serif italic font-normal text-[#582128]">Be Seen.</em>
          </h1>

          {/* Body Description */}
          <p className="font-sans text-base sm:text-lg text-[#1A0F0A]/70 max-w-lg leading-relaxed">
            KalaConnect gives India&apos;s traditional artists the tools to tell
            their story, build a digital identity, and reach customers across
            the world.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/artists"
              className="bg-[#702D35] text-[#FAF6EF] px-7 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#582128] transition-all flex items-center gap-2.5 shadow-md group"
            >
              Explore Artists
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <Link
              href="/join"
              className="border border-[#702D35] text-[#702D35] bg-transparent px-7 py-3.5 rounded-lg font-sans font-semibold text-sm hover:bg-[#702D35] hover:text-[#FAF6EF] transition-all"
            >
              Join as an Artist
            </Link>
          </div>

          {/* Social Proof with exact prototype avatars */}
          <div className="flex items-center gap-3.5 pt-4">
            <div className="relative w-24 h-9 flex-shrink-0">
              <Image
                src="/images/hero_avatars.png"
                alt="Featured artists on KalaConnect"
                fill
                className="object-contain object-left"
              />
            </div>
            <div className="text-sm font-sans">
              <span className="font-bold text-[#1A0F0A]">4,800+ artists</span>
              <span className="text-[#1A0F0A]/60 ml-1.5">growing with KalaConnect</span>
            </div>
          </div>
        </div>

        {/* Right Prototype Hero Collage - Exact from Figma */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[480px] aspect-[445/607] drop-shadow-xl select-none">
            <Image
              src="/images/hero_collage.png"
              alt="KalaConnect traditional artisan storytelling collage"
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
