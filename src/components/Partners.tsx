import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import hecLogo from "@/assets/logo-hec.png";
import polytechniqueLogo from "@/assets/logo-polytechnique.png";
import epitaLogo from "@/assets/logo-epita.png";
import ensLogo from "@/assets/logo-ens.jpeg";
import mvaLogo from "@/assets/logo-mva.jpeg";
import telecomLogo from "@/assets/logo-telecom.svg";

const partners = [
  { name: "École Polytechnique", logo: polytechniqueLogo },
  { name: "HEC Paris", logo: hecLogo },
  { name: "EPITA", logo: epitaLogo },
  { name: "ENS", logo: ensLogo },
  { name: "MVA", logo: mvaLogo },
  { name: "Télécom Paris", logo: telecomLogo },
];

const Partners = () => {
  const { t } = useLanguage();
  const scrollPartners = [...partners, ...partners];

  return (
    <section id="partners" className="py-12 md:py-20 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-widest text-white/30 mb-12">
            {t("partners.title")}
          </p>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--dark-bg)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--dark-bg)] to-transparent z-10" />

        <div className="flex animate-scroll-x hover:pause w-max">
          {scrollPartners.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex-shrink-0 px-8 md:px-12 flex items-center justify-center"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-10 md:h-14 w-auto object-contain opacity-80 hover:opacity-100 transition-all duration-500"
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
