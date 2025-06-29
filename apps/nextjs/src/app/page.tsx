import SafeArea from "~/app/_components/layout/safe-area";
import FeaturesSection from "~/app/_components/marketing/features-section";
import Footer from "~/app/_components/marketing/footer";
import LandingHero from "~/app/_components/marketing/landing-hero";
import PricingSection from "~/app/_components/marketing/pricing-section";
import { createClient } from "~/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  return (
    <SafeArea>
      <div className="min-h-screen bg-[#0A0A0A]">
        <LandingHero />
        <FeaturesSection />
        <PricingSection />
        <Footer />
      </div>
    </SafeArea>
  );
}
