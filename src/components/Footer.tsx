import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logoSymbol from "@/assets/logo-symbol.svg";
import logoWordmark from "@/assets/logo-wordmark.svg";

const Footer = () => {
  const { t, language } = useLanguage();

  const legalLinks = [
    { path: "/terms", label: language === "fr" ? "Conditions d'utilisation" : "Terms of Use" },
    { path: "/privacy", label: language === "fr" ? "Politique de confidentialité" : "Privacy Policy" },
    { path: "/security", label: language === "fr" ? "Politique de sécurité" : "Security Policy" },
    { path: "/mentions-legales", label: "Mentions légales" },
  ];

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
                <a href="mailto:contact@fleuret.ai" className="block hover:text-white transition-colors">
                  contact@fleuret.ai
                </a>
                <p>60 Rue François 1er, 75008 Paris</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider font-sans">Legal</h3>
              <div className="space-y-2 text-sm">
                {legalLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="block text-white/30 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
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
