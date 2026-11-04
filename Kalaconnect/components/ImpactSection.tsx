'use client';

import { Users, Eye, Sparkles, Globe2, Award, HeartHandshake } from 'lucide-react';

const impactMetrics = [
  {
    number: '4,800+',
    label: 'Traditional Artists Empowered',
    subtext: 'Across 22 states of India',
    icon: Users,
  },
  {
    number: '28,000+',
    label: 'Monthly Portfolio Views',
    subtext: 'Direct global patron reach',
    icon: Eye,
  },
  {
    number: '120+',
    label: 'Living Traditions Preserved',
    subtext: 'Centuries-old folk art forms',
    icon: Sparkles,
  },
  {
    number: '42',
    label: 'Countries Reached',
    subtext: 'Global appreciation & buyers',
    icon: Globe2,
  },
  {
    number: '100%',
    label: 'Authentic Handmade Art',
    subtext: 'Verified artisan lineage',
    icon: Award,
  },
  {
    number: '₹1.8 Cr+',
    label: 'Direct Artist Enquiries',
    subtext: 'Zero commission to middlemen',
    icon: HeartHandshake,
  },
];

export default function ImpactSection() {
  return (
    <section id="impact" className="bg-[#FAF6EF] py-24 border-t border-[#E7DDD0]/80">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <div className="section-label">Our impact</div>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-[#1A0F0A]">
            Empowering the hands that keep{' '}
            <em className="text-[#582128] font-serif italic font-normal">heritage alive</em>
          </h2>
          <p className="font-sans text-base text-[#1A0F0A]/70 leading-relaxed">
            By giving master artisans direct digital presence, we bridge centuries of
            tradition with modern economic independence.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {impactMetrics.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-8 border border-[#E7DDD0]/70 shadow-sm hover:shadow-md transition-shadow space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF6EF] border border-[#E7DDD0] flex items-center justify-center text-[#702D35]">
                  <Icon size={24} />
                </div>
                <div className="font-serif text-4xl sm:text-5xl font-semibold text-[#1A0F0A] tracking-tight">
                  {item.number}
                </div>
                <div className="font-sans font-semibold text-base text-[#1A0F0A]">
                  {item.label}
                </div>
                <div className="font-sans text-xs text-[#1A0F0A]/50">
                  {item.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
