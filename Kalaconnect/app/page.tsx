import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ArtFormsSection from '@/components/ArtFormsSection';
import FeaturedArtistsSection from '@/components/FeaturedArtistsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import StorySection from '@/components/StorySection';
import ImpactSection from '@/components/ImpactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main className="bg-[#FAF6EF]">
      <Navbar />
      <HeroSection />
      <ArtFormsSection />
      <FeaturedArtistsSection />
      <HowItWorksSection />
      <StorySection />
      <ImpactSection />
      <Footer />
    </main>
  );
}
