"use client";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import SocialProofBar from "./SocialProofBar";
import AboutSection from "./AboutSection";
import HowItWorksSection from "./HowItWorksSection";
import BenefitsSection from "./BenefitsSection";
import CtaBanner from "./CtaBanner";
import TestimonialsSection from "./TestimonialsSection";
import PricingSection from "./PricingSection";
import CtaSection from "./CtaSection";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="bg-white text-[#111827] font-jakarta antialiased scroll-smooth">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProofBar />
        <AboutSection />
        <HowItWorksSection />
        <BenefitsSection />
        <CtaBanner />
        <TestimonialsSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
