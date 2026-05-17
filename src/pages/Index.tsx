import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { PrerenderMarker } from "@/components/PrerenderMarker";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SEO,
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
} from "@/seo/SEO";

// Below-fold sections lazy-loaded so their JS chunks don't compete with the
// hero render on first paint. Suspense resolves once all five resolve, then
// PrerenderMarker flips data-home-rendered="true" on <html> — scripts/
// prerender.mjs waits on that flag for the `/` route so the static HTML
// still ships full content for SEO (Lighthouse W9 P4 2026-05-17).
const WhySection = lazy(() => import("@/components/WhySection"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const ComparisonTable = lazy(() => import("@/components/ComparisonTable"));
const PricingSection = lazy(() => import("@/components/PricingSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen" key={language}>
      <SEO
        pageKey="home"
        jsonLd={[
          organizationJsonLd(),
          websiteJsonLd(),
          softwareApplicationJsonLd(language),
        ]}
      />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Suspense fallback={null}>
          <WhySection />
          <HowItWorks />
          <ComparisonTable />
          <PricingSection />
          <CTASection />
          <Footer />
          <PrerenderMarker flag="homeRendered" />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
