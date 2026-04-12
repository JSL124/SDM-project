import HeroSection from '@/components/sections/HeroSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import FeaturedCampaignsSection from '@/components/sections/FeaturedCampaignsSection';
import TrustSection from '@/components/sections/TrustSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <HowItWorksSection />
      <FeaturedCampaignsSection />
      <TrustSection />
    </main>
  );
}
