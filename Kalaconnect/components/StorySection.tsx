'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function StorySection() {
  return (
    <section className="bg-[#2D2523] py-24 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-6 space-y-8 order-2 lg:order-1">
            <div className="section-label">
              Where every detail has meaning
            </div>

            <h2 className="font-serif text-5xl sm:text-6xl font-medium text-white leading-[1.08] tracking-tight">
              Made by<br />
              hand.<br />
              Carried by<br />
              <em className="text-[#C9A060] font-serif italic font-normal">heart.</em>
            </h2>

            <p className="font-sans text-base sm:text-lg text-white/70 max-w-lg leading-relaxed">
              Behind every brushstroke, carved line, and woven thread is a
              story that deserves more than admiration—it deserves a future.
            </p>

            <div>
              <Link
                href="/artists"
                className="inline-flex items-center gap-2 text-[#C9A060] font-sans font-semibold text-sm hover:gap-3 transition-all group"
              >
                Discover their stories
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {/* Artisan Quote Box */}
            <div className="pt-4 border-l-2 border-[#C9A060]/40 pl-6 space-y-3">
              <div className="text-3xl font-serif text-[#C9A060] leading-none select-none">
                &ldquo;&ldquo;
              </div>
              <p className="font-serif text-xl sm:text-2xl text-white/95 italic font-light leading-relaxed">
                My hands remember what generations taught them.
              </p>
              <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C4522A] font-semibold">
                Ramesh Kumar &bull; Blue Pottery Artisan
              </div>
            </div>
          </div>

          {/* Right Prototype Story Collage - Exact from Figma */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] aspect-[465/580] drop-shadow-2xl select-none">
              <Image
                src="/images/story_collage.png"
                alt="Made by hand, carried by heart — KalaConnect artisan craft process"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
