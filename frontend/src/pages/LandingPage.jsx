import React from "react";
import HeroSection from "../components/landing/HeroSection";
import AboutSection from "../components/landing/AboutSection";
import ClimateStatsSection from "../components/landing/ClimateStatsSection";
import ProductionSection from "../components/landing/ProductionSection";
import PerformanceSection from "../components/landing/PerformanceSection";
import FAQSection from "../components/landing/FAQSection";
import DashboardPreview from "../components/landing/DashboardPreview";
import PartnersSection from "../components/landing/PartnersSection";
import NewsletterSection from "../components/landing/NewsletterSection";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ClimateStatsSection />
      <ProductionSection />
      <PerformanceSection />
      <FAQSection />
      <DashboardPreview />
      <PartnersSection />
      <NewsletterSection />
    </>
  );
}
