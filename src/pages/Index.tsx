import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhySection from "@/components/WhySection";
import Benchmark from "@/components/Benchmark";
import HowItWorks from "@/components/HowItWorks";
import ComparisonTable from "@/components/ComparisonTable";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  SEO,
  organizationJsonLd,
  websiteJsonLd,
  softwareApplicationJsonLd,
} from "@/seo/SEO";

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
        <WhySection />
        <Benchmark />
        <HowItWorks />
        <ComparisonTable />
        <PricingSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
