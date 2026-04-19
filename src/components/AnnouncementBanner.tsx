import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "fleuret.announce.preseed.dismissed";
// Optional external link; set to "" to hide CTA.
const ANNOUNCE_HREF = "";

const AnnouncementBanner = () => {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY) === "1";
      setVisible(!dismissed);
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (visible) {
      root.style.setProperty("--announce-h", "40px");
    } else {
      root.style.removeProperty("--announce-h");
    }
    return () => { root.style.removeProperty("--announce-h"); };
  }, [visible]);

  if (!visible) return null;

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label={t("announce.label")}
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center"
      style={{
        height: "40px",
        background: "linear-gradient(90deg, rgba(79,143,255,0.18), rgba(139,92,246,0.18))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0 mx-auto">
          <span
            style={{
              fontSize: "0.6rem",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "0.15rem 0.5rem",
              borderRadius: "999px",
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {t("announce.label")}
          </span>
          <span
            className="text-white/85 truncate"
            style={{ fontSize: "0.82rem", letterSpacing: "0.01em" }}
          >
            {t("announce.text")}
          </span>
          {ANNOUNCE_HREF && (
            <a
              href={ANNOUNCE_HREF}
              className="hidden sm:inline text-white/90 hover:text-white underline underline-offset-2 decoration-white/30 hover:decoration-white"
              style={{ fontSize: "0.82rem" }}
            >
              {t("announce.cta")}
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("announce.dismiss")}
          className="flex items-center justify-center w-7 h-7 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 2 L10 10 M10 2 L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
