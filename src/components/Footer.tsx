import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logoSymbol from "@/assets/logo-symbol.svg";
import logoWordmark from "@/assets/logo-wordmark.svg";

const Footer = () => {
  const { language } = useLanguage();

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "4rem 0" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12" style={{ marginBottom: "3rem", maxWidth: "72rem", marginLeft: "auto", marginRight: "auto" }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <img src={logoSymbol} alt="" className="brightness-0 invert" style={{ height: 32, width: "auto", objectFit: "contain" }} width="34" height="59" />
              <img src={logoWordmark} alt="Fleuret" className="brightness-0 invert" style={{ height: 32, width: "auto", objectFit: "contain" }} width="49" height="12" />
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
              {language === "fr" ? "Pentest IA, hébergé en Europe." : "AI pentesting, hosted in Europe."}
            </p>
          </div>

          {/* Company */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {language === "fr" ? "Entreprise" : "Company"}
            </h3>
            <Link to="/about"   style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              {language === "fr" ? "À propos" : "About"}
            </Link>
            <Link to="/careers" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              {language === "fr" ? "Carrières" : "Careers"}
            </Link>
            <Link to="/design-partners" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              Design Partners
            </Link>
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {language === "fr" ? "Contact" : "Contact"}
            </h3>
            <a href="mailto:yanis@fleuret.ai" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              yanis@fleuret.ai
            </a>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>60 Rue François 1er, 75008 Paris</p>
          </div>

          {/* Legal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Legal</h3>
            {[
              { path: "/terms",           label: language === "fr" ? "Conditions d'utilisation" : "Terms of Use" },
              { path: "/privacy",         label: language === "fr" ? "Politique de confidentialité" : "Privacy Policy" },
              { path: "/security",        label: language === "fr" ? "Politique de sécurité" : "Security Policy" },
              { path: "/mentions-legales",label: "Mentions légales" },
            ].map((l) => (
              <Link
                key={l.path}
                to={l.path}
                style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", maxWidth: "72rem", margin: "0 auto" }}>
          <p style={{ margin: 0 }}>© 2026 fleuret.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
