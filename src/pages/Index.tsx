import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PricingSection from "@/components/PricingSection";
import { PrerenderMarker } from "@/components/PrerenderMarker";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SEO,
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
} from "@/seo/SEO";

// Below-fold sections lazy-loaded so their JS chunks don't compete with the
// hero render on first paint. PricingSection is eager-loaded because the hero
// secondary CTA links to `#pricing` and GA4 week May 3-30 shows the click
// firing 206 times across 29 users (7.1/user) — the hydration race makes the
// anchor smooth-scroll unresponsive on slow nets so users mash the button.
// Eager-load guarantees the scroll handler is wired on first interactive paint.
const WhySection = lazy(() => import("@/components/WhySection"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const ComparisonTable = lazy(() => import("@/components/ComparisonTable"));
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
