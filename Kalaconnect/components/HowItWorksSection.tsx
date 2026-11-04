'use client';

import { User, Sparkles, QrCode } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: User,
    title: 'Create your profile',
    description:
      'Tell us about yourself, your tradition, and the art you practice.',
  },
  {
    number: '02',
    icon: Sparkles,
    title: 'Add your artwork',
    description:
      'Upload a photo. Our AI helps write a beautiful story for it.',
  },
  {
    number: '03',
    icon: QrCode,
    title: 'Share your portfolio',
    description:
      'Get your own digital portfolio and QR code, instantly.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#702D35] py-24 relative overflow-hidden text-white">
      {/* Decorative concentric watermark circles as seen in Figma */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07] overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-circles" width="120" height="120" patternUnits="userSpaceOnUse">
              <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-circles)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-20 max-w-2xl mx-auto">
          <div className="flex justify-center">
            <div className="section-label-gold">Simple by design</div>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-white">
            From your hands to the{' '}
            <em className="text-[#C9A060] font-serif italic font-normal">world</em>
          </h2>
          <p className="font-sans text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
            No technical skills needed. If you can take a photo, you can build
            your digital presence.
          </p>
        </div>

        {/* 3 Step Circular Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
          {/* Connecting dashed line on desktop */}
          <div className="hidden md:block absolute top-[50px] left-[18%] right-[18%] h-0 border-t border-dashed border-white/25 z-0" />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center relative z-10 flex flex-col items-center">
                {/* Circle with Icon & Number Badge */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full border border-white/30 flex items-center justify-center bg-[#702D35]/60 backdrop-blur-sm shadow-inner transition-transform hover:scale-105 duration-300">
                    <Icon size={30} className="text-white/85" />
                  </div>
                  {/* Gold Pill Badge */}
                  <div className="absolute top-0 right-0 -mr-1 -mt-1 w-7 h-7 rounded-full bg-[#C9A060] flex items-center justify-center shadow-md">
                    <span className="text-[11px] font-sans font-bold text-[#582128]">
                      {step.number}
                    </span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-medium text-white mb-3">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-white/70 max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
