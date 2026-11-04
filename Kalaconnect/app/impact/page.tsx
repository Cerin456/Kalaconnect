import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Users, TrendingUp, Globe, Heart, Award, Sparkles } from 'lucide-react';

const stats = [
  { label: 'Artists on Platform', value: '4,800+', icon: Users, color: 'text-rust' },
  { label: 'Portfolio Views / Month', value: '28k+', icon: TrendingUp, color: 'text-gold' },
  { label: 'Countries Reached', value: '42', icon: Globe, color: 'text-maroon' },
  { label: 'Art Forms Preserved', value: '120+', icon: Heart, color: 'text-rust' },
  { label: 'Verified Master Artists', value: '380+', icon: Award, color: 'text-gold' },
  { label: 'AI Stories Generated', value: '15k+', icon: Sparkles, color: 'text-maroon' },
];

export default function ImpactPage() {
  return (
    <main>
      <Navbar />
      <div className="bg-cream min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-16 space-y-4">
            <div className="flex justify-center">
              <div className="section-label">Our impact</div>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#1A0F0A]">
              Numbers that tell a{' '}
              <em className="text-gold-italic">story</em>
            </h1>
            <p className="font-sans text-base text-[#1A0F0A]/60 max-w-lg mx-auto">
              Every statistic represents a real artist, a real tradition, and a
              real future being built together.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white border border-cream-dark rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                  <Icon size={28} className={`${stat.color} mb-4`} />
                  <div className="font-serif text-5xl font-bold text-[#1A0F0A] mb-2">
                    {stat.value}
                  </div>
                  <div className="font-sans text-sm text-[#1A0F0A]/60">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mission statement */}
          <div className="bg-maroon rounded-2xl p-10 md:p-16 text-center space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-white">
              Every artist deserves a future as bright as their{' '}
              <em className="text-gold italic">craft.</em>
            </h2>
            <p className="font-sans text-base text-white/60 max-w-2xl mx-auto">
              KalaConnect is committed to ensuring that India&apos;s rich artistic
              heritage thrives in the digital age — connecting tradition with
              opportunity, one artist at a time.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
