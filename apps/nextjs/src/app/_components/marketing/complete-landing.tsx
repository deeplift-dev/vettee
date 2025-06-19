"use client";

import LandingHero from "./landing-hero";
import FeaturesSection from "./features-section";
import PricingSection from "./pricing-section";
import Footer from "./footer";

export default function CompleteLanding() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <LandingHero />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}