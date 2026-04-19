import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "fleuret_cookie_consent";

type Consent = "accepted" | "denied";

const CookieBanner = () => {
  const { language } = useLanguage();
  const isFr = language === "fr";

  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== "accepted" && stored !== "denied") {
      setVisible(true);
      const t = window.setTimeout(() => setEntered(true), 60);
      return () => window.clearTimeout(t);
    }
  }, []);

  const record = (choice: Consent) => {
    localStorage.setItem(STORAGE_KEY, choice);
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: choice }));
    setEntered(false);
    window.setTimeout(() => setVisible(false), 250);
  };

  if (!visible) return null;

  const linkStyle =
    "text-[0.75rem] text-white/50 hover:text-white transition-colors underline-offset-4 hover:underline";

  return (
    <div
      role="region"
      aria-label={isFr ? "Paramètres de confidentialité" : "Privacy settings"}
      className="fixed inset-x-0 bottom-0 z-[60] flex justify-center pointer-events-none px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div
        className="pointer-events-auto w-full max-w-[680px] rounded-2xl border border-white/10 backdrop-blur-xl p-5 sm:p-6 relative"
        style={{
          background: "rgba(16,18,30,0.92)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02) inset",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 250ms ease, transform 250ms ease",
        }}
      >
        <button
          type="button"
          onClick={() => record("denied")}
          aria-label={isFr ? "Fermer" : "Close"}
          className="absolute top-3 right-3 w-8 h-8 inline-flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M1 1 L13 13 M13 1 L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2
          className="text-white font-medium tracking-[-0.01em] pr-8"
          style={{ fontSize: "1rem" }}
        >
          {isFr ? "Paramètres de confidentialité" : "Privacy Settings"}
        </h2>

        <p
          className="mt-2 text-[0.8125rem] leading-relaxed text-white/55"
        >
          {isFr
            ? "Ce site utilise des technologies tierces de suivi pour fournir et améliorer nos services en continu, et afficher des informations selon les centres d'intérêt des utilisateurs. J'accepte et peux révoquer ou modifier mon consentement à tout moment avec effet pour l'avenir."
            : "This site uses third-party website tracking technologies to provide and continually improve our services, and to display information according to users' interests. I agree and may revoke or change my consent at any time with effect for the future."}
        </p>

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/privacy" className={linkStyle}>
              {isFr ? "Politique de confidentialité" : "Privacy Policy"}
            </Link>
            <Link to="/mentions-legales" className={linkStyle}>
              {isFr ? "Mentions légales" : "Legal Notice"}
            </Link>
            <HashLink to="/privacy#cookies" smooth className={linkStyle}>
              {isFr ? "Plus d'informations" : "More Information"}
            </HashLink>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 sm:flex-shrink-0">
            <button
              type="button"
              onClick={() => record("denied")}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-[0.8125rem] font-medium text-white bg-white/10 border border-white/30 hover:bg-white/20 hover:border-white/50 transition-colors"
            >
              {isFr ? "Refuser" : "Deny"}
            </button>
            <button
              type="button"
              onClick={() => record("accepted")}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full text-[0.8125rem] font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(79,143,255,0.35)] active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
              }}
            >
              {isFr ? "Tout accepter" : "Accept All"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
