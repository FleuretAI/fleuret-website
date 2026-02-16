import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import hecLogo from "@/assets/logo-hec.png";
import polytechniqueLogo from "@/assets/logo-polytechnique.png";
import epitaLogo from "@/assets/logo-epita.png";
import ensLogo from "@/assets/logo-ens.jpeg";
import mvaLogo from "@/assets/logo-mva.jpeg";
import telecomLogo from "@/assets/logo-telecom.svg";

const partners = [
  { name: "École Polytechnique", logo: polytechniqueLogo, isText: false },
  { name: "HEC Paris", logo: hecLogo, isText: false },
  { name: "EPITA", logo: epitaLogo, isText: false },
  { name: "ENS", logo: ensLogo, isText: false },
  { name: "MVA", logo: mvaLogo, isText: false },
  { name: "Télécom Paris", logo: telecomLogo, isText: false },
];

const Partners = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);
  };

  const handleManualNavigation = (action: () => void) => {
    setAutoPlayEnabled(false);
    action();
  };

  useEffect(() => {
    if (autoPlayEnabled) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlayEnabled, currentIndex]);

  const getVisiblePartners = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + partners.length) % partners.length;
      visible.push({
        partner: partners[index],
        offset: i,
        index: index
      });
    }
    return visible;
  };

  return (
    <section id="partners" className="pt-12 pb-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-5xl md:text-6xl font-urbanist">
            <span className="text-gradient">{t('partners.title')}</span>
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Button
            variant="default"
            size="lg"
            onClick={() => handleManualNavigation(prevSlide)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-14 h-14 shadow-lg"
            aria-label="Partenaire précédent"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="overflow-hidden px-12 md:px-24">
            <div className="flex justify-center items-center gap-4 md:gap-8 min-h-[120px] md:min-h-[200px] transition-all duration-500">
              {getVisiblePartners().map(({ partner, offset, index }) => (
                <div
                  key={`${partner.name}-${index}`}
                  className={`flex-shrink-0 transition-all duration-500 flex items-center justify-center ${
                    offset === 0 ? 'scale-110' : 'scale-75'
                  }`}
                  style={{
                    opacity: offset === 0 ? 1 : 0.3,
                    width: isMobile ? '80px' : '200px',
                    height: isMobile ? '60px' : '120px'
                  }}
                >
                  <div
                    className="w-full h-full rounded-3xl flex items-center justify-center"
                    style={{
                      backgroundColor: offset === 0
                        ? 'rgba(242,242,248,0.08)'
                        : 'rgba(242,242,248,0.04)',
                    }}
                  >
                    <img
                      src={partner.logo}
                      alt={`Logo ${partner.name} - Partenaire académique et professionnel de Fleuret AI`}
                      className="max-h-12 md:max-h-28 max-w-full w-auto object-contain transition-opacity"
                      loading="lazy"
                      width="200"
                      height="120"
                      style={{
                        filter: offset === 0 
                          ? 'drop-shadow(0 0 15px rgba(0,0,0,0.35))'
                          : 'none',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="default"
            size="lg"
            onClick={() => handleManualNavigation(nextSlide)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full w-14 h-14 shadow-lg"
            aria-label="Partenaire suivant"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="flex justify-center gap-2 mt-12" role="tablist" aria-label="Navigation partenaires">
            {partners.map((partner, index) => (
              <button
                key={index}
                onClick={() => handleManualNavigation(() => setCurrentIndex(index))}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-primary/30 hover:bg-primary/50 w-2"
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Afficher ${partner.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
