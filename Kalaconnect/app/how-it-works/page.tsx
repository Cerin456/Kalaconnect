import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HowItWorksSection from '@/components/HowItWorksSection';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <main>
      <Navbar />
      <div className="bg-cream pt-24">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="section-label">Simple by design</div>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#1A0F0A] mb-6">
            Your digital journey,
            <br />
            <em className="text-gold-italic">simplified.</em>
          </h1>
          <p className="font-sans text-base text-[#1A0F0A]/60 max-w-lg mx-auto mb-10">
            No technical skills needed. If you can take a photo, you can build
            your digital presence on KalaConnect.
          </p>
          <Link
            href="/join"
            className="inline-flex items-center gap-2 bg-maroon text-cream px-8 py-4 font-sans font-semibold hover:bg-maroon-dark transition-colors"
          >
            Start Your Journey →
          </Link>
        </div>
      </div>
      <HowItWorksSection />

      {/* FAQ placeholder */}
      <div className="bg-cream py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-semibold text-[#1A0F0A] text-center mb-10">
            Frequently asked questions
          </h2>
          {[
            { q: 'Is KalaConnect free for artists?', a: 'Yes! Creating a profile and portfolio on KalaConnect is completely free for all artists.' },
            { q: 'What languages are supported?', a: 'KalaConnect supports Hindi, English, and several regional languages to ensure every artist can use the platform comfortably.' },
            { q: 'How does the AI story generator work?', a: 'Simply upload a photo of your artwork. Our AI analyzes it and generates a beautiful, authentic narrative about the piece — which you can review and edit.' },
            { q: 'Do I need a smartphone or computer?', a: 'A basic smartphone with a camera is enough to get started on KalaConnect.' },
          ].map((faq, i) => (
            <div key={i} className="border-b border-cream-dark py-6">
              <h3 className="font-serif text-lg font-semibold text-[#1A0F0A] mb-2">{faq.q}</h3>
              <p className="font-sans text-sm text-[#1A0F0A]/60 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
