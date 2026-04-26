import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logoSymbol from "@/assets/logo-symbol.svg";
import logoWordmark from "@/assets/logo-wordmark.svg";

const ASK_AI_PROMPTS = {
  en: "As a CISO or security leader evaluating AI pentesting vendors, I want to understand what Fleuret offers. Explain how Fleuret automates penetration testing, delivers continuous security validation, and is hosted in Europe for GDPR compliance and data sovereignty, and how it compares with manual pentest firms and other AI pentest tools. Summarize key capabilities, use cases for regulated industries (finance, healthcare, public sector), and differentiators from https://fleuret.ai",
  fr: "En tant que RSSI ou responsable sécurité évaluant des solutions de pentest IA, je veux comprendre ce que propose Fleuret. Expliquez comment Fleuret automatise les tests d'intrusion, offre une validation continue de la sécurité, et est hébergé en Europe pour la conformité RGPD et la souveraineté des données, et comment il se compare aux cabinets de pentest manuels et aux autres outils IA. Résumez les capacités clés, cas d'usage pour les secteurs régulés (finance, santé, secteur public), et différenciateurs depuis https://fleuret.ai",
};

const ENCODED_ASK_AI_PROMPTS = {
  en: encodeURIComponent(ASK_AI_PROMPTS.en),
  fr: encodeURIComponent(ASK_AI_PROMPTS.fr),
};

const askAiProviders = [
  { name: "ChatGPT",    logo: "/ai-logos/openai.svg",     url: (q: string) => `https://chat.openai.com/?q=${q}` },
  { name: "Claude",     logo: "/ai-logos/claude.svg",     url: (q: string) => `https://claude.ai/new?q=${q}` },
  { name: "Perplexity", logo: "/ai-logos/perplexity.svg", url: (q: string) => `https://www.perplexity.ai/search/new?q=${q}` },
  { name: "Google AI",  logo: "/ai-logos/google.svg",     url: (q: string) => `https://www.google.com/search?udm=50&aep=11&q=${q}` },
  { name: "Grok",       logo: "/ai-logos/grok.svg",       url: (q: string) => `https://x.com/i/grok?text=${q}` },
];

const Footer = () => {
  const { language, t, localize } = useLanguage();
  const encodedPrompt = ENCODED_ASK_AI_PROMPTS[language === "fr" ? "fr" : "en"];

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "4rem 0" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12" style={{ marginBottom: "3rem", maxWidth: "72rem", marginLeft: "auto", marginRight: "auto" }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <img src={logoSymbol} alt="" className="brightness-0 invert" style={{ height: 32, width: "auto", objectFit: "contain" }} width="59" height="111" />
              <img src={logoWordmark} alt="Fleuret" className="brightness-0 invert" style={{ height: 32, width: "auto", objectFit: "contain" }} width="454" height="111" />
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>
              {t("footer.tagline")}
            </p>
          </div>

          {/* Company */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {t("nav.company")}
            </h3>
            <Link to={localize("/about")}   style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              {t("footer.about")}
            </Link>
            <Link to={localize("/careers")} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              {t("footer.careers")}
            </Link>
            <Link to={localize("/design-partners")} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              {t("footer.designPartners")}
            </Link>
            <Link to={localize("/resources")} style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              {t("nav.resources")}
            </Link>
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {t("footer.contact")}
            </h3>
            <a href="mailto:yanis@fleuret.ai" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}>
              yanis@fleuret.ai
            </a>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>60 Rue François 1er, 75008 Paris</p>
          </div>

          {/* Legal */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{t("footer.legal")}</h3>
            {[
              { path: localize("/terms"),   label: t("footer.legal.terms") },
              { path: localize("/privacy"), label: t("footer.legal.privacy") },
              { path: localize("/security"),label: t("footer.legal.security") },
              { path: "/mentions-legales",  label: t("footer.legal.mentions") },
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

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1.5rem 0", maxWidth: "72rem", margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
            {t("footer.askAi")}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {askAiProviders.map((p) => (
              <a
                key={p.name}
                href={p.url(encodedPrompt)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("footer.openIn")} ${p.name}`}
                title={p.name}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", transition: "background 0.2s, border-color 0.2s", outline: "none" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                onFocus={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)"; }}
                onBlur={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <img src={p.logo} alt="" width="16" height="16" style={{ width: 16, height: 16, objectFit: "contain" }} />
              </a>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.875rem", maxWidth: "72rem", margin: "0 auto" }}>
          <p style={{ margin: 0 }}>{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
