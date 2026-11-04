'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#E7DDD0]/70 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo - Exact from Figma */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-11 w-44">
            <Image
              src="/images/logo.png"
              alt="KalaConnect - Art · Identity · Opportunity"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/artists"
            className="text-sm font-sans font-medium text-[#1A0F0A]/85 hover:text-[#702D35] transition-colors"
          >
            Explore Artists
          </Link>
          <Link
            href="/exhibitions"
            className="text-sm font-sans font-medium text-[#1A0F0A]/85 hover:text-[#702D35] transition-colors"
          >
            Exhibitions
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-sans font-medium text-[#1A0F0A]/85 hover:text-[#702D35] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#impact"
            className="text-sm font-sans font-medium text-[#1A0F0A]/85 hover:text-[#702D35] transition-colors"
          >
            Our Impact
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-sans font-medium text-[#1A0F0A]/85 hover:text-[#702D35] transition-colors"
          >
            Portal Dashboard
          </Link>
          <Link
            href="/join"
            className="bg-[#702D35] text-[#FAF6EF] px-6 py-2.5 rounded-lg text-sm font-sans font-semibold hover:bg-[#582128] transition-all flex items-center gap-2 group shadow-sm"
          >
            Join as an Artist
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          className="md:hidden p-2 text-[#702D35]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#FAF6EF] border-t border-[#E7DDD0] px-6 py-5 flex flex-col gap-4 shadow-lg">
          <Link
            href="/artists"
            className="text-base font-sans font-medium text-[#1A0F0A] py-1"
            onClick={() => setMobileOpen(false)}
          >
            Explore Artists
          </Link>
          <Link
            href="/exhibitions"
            className="text-base font-sans font-medium text-[#1A0F0A] py-1"
            onClick={() => setMobileOpen(false)}
          >
            Virtual Exhibitions
          </Link>
          <Link
            href="/#how-it-works"
            className="text-base font-sans font-medium text-[#1A0F0A] py-1"
            onClick={() => setMobileOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="/#impact"
            className="text-base font-sans font-medium text-[#1A0F0A] py-1"
            onClick={() => setMobileOpen(false)}
          >
            Our Impact
          </Link>
          <Link
            href="/dashboard"
            className="text-base font-sans font-medium text-[#1A0F0A] py-1"
            onClick={() => setMobileOpen(false)}
          >
            Portal Dashboard
          </Link>
          <Link
            href="/join"
            className="bg-[#702D35] text-[#FAF6EF] px-6 py-3 rounded-lg text-base font-sans font-semibold text-center mt-2"
            onClick={() => setMobileOpen(false)}
          >
            Join as an Artist →
          </Link>
        </div>
      )}
    </header>
  );
}
