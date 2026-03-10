import { useLanguage } from "@/contexts/LanguageContext";
import logoSymbol from "@/assets/logo-symbol.svg";
import logoWordmark from "@/assets/logo-wordmark.svg";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/5 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <img src={logoSymbol} alt="" className="h-8 w-auto object-contain brightness-0 invert" width="34" height="59" />
                <img src={logoWordmark} alt="Fleuret" className="h-8 w-auto object-contain brightness-0 invert" width="49" height="12" />
              </div>
              <p className="text-white/30 text-sm leading-relaxed">{t("footer.tagline")}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider font-sans">{t("footer.contact")}</h3>
              <div className="space-y-2 text-white/30 text-sm">
                <a href="mailto:contact@fleuret-ai.com" className="block hover:text-white transition-colors">
                  contact@fleuret-ai.com
                </a>
                <p>14 Rue Ballu, 75009 Paris</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider font-sans">{t("footer.program")}</h3>
              <p className="text-white/30 text-sm">{t("footer.program.hec")}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center">
            <p className="text-white/20 text-sm">{t("footer.rights")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
