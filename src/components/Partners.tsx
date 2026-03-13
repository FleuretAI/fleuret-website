import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import hecLogo from "@/assets/logo-hec.png";
import polytechniqueLogo from "@/assets/logo-polytechnique.png";
import epitaLogo from "@/assets/logo-epita.png";
import ensLogo from "@/assets/logo-ens.jpeg";
import mvaLogo from "@/assets/logo-mva.jpeg";
import telecomLogo from "@/assets/logo-telecom.svg";

export const partners = [
  { name: "École Polytechnique", logo: polytechniqueLogo },
  { name: "HEC Paris", logo: hecLogo },
  { name: "EPITA", logo: epitaLogo },
  { name: "ENS", logo: ensLogo },
  { name: "MVA", logo: mvaLogo },
  { name: "Télécom Paris", logo: telecomLogo },
];

const Partners = () => {
  const { t } = useLanguage();

  return (
    <section id="partners" className="py-12 md:py-20 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-widest text-white/30 mb-8 md:mb-12">
            {t("partners.title")}
          </p>
        </ScrollReveal>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 max-w-4xl mx-auto">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-8 sm:h-10 md:h-14 w-auto object-contain opacity-80 hover:opacity-100 transition-all duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
