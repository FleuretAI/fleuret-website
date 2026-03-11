import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Partners from "@/components/Partners";
import WhySection from "@/components/WhySection";
import Benchmark from "@/components/Benchmark";
import HowItWorks from "@/components/HowItWorks";
import ComparisonTable from "@/components/ComparisonTable";
import PricingSection from "@/components/PricingSection";
import ComplianceSection from "@/components/ComplianceSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <WhySection />
        <Benchmark />
        <HowItWorks />
        <ComparisonTable />
        <PricingSection />
        <ComplianceSection />
        <CTASection />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
