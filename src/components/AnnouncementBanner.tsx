import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const HIDE_THRESHOLD_PX = 40;
// Optional external link; set to "" to hide CTA.
const ANNOUNCE_HREF = "";
const BANNER_HEIGHT_PX = 64;

const AnnouncementBanner = () => {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > HIDE_THRESHOLD_PX);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (hidden) {
      root.style.removeProperty("--announce-h");
    } else {
      root.style.setProperty("--announce-h", `${BANNER_HEIGHT_PX}px`);
    }
    return () => { root.style.removeProperty("--announce-h"); };
  }, [hidden]);

  return (
    <div
      role="region"
      aria-label={t("announce.label")}
      aria-hidden={hidden}
      className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center"
      style={{
        height: `${BANNER_HEIGHT_PX}px`,
        background: "linear-gradient(90deg, rgba(79,143,255,0.22), rgba(139,92,246,0.22))",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1), opacity 250ms ease",
        willChange: "transform",
      }}
    >
      <div className="max-w-[1280px] w-full mx-auto px-4 md:px-8 flex items-center justify-center gap-3 md:gap-4">
        <span
          aria-hidden="true"
          className="announce-dot"
          style={{
            position: "relative",
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ff9603",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "clamp(0.7rem, 1vw, 0.78rem)",
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#fbbf24",
            flexShrink: 0,
          }}
        >
          {t("announce.label")}
        </span>
        <span
          className="text-white truncate"
          style={{
            fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          {t("announce.text")}
        </span>
        {ANNOUNCE_HREF && (
          <a
            href={ANNOUNCE_HREF}
            className="hidden sm:inline text-white/90 hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white"
            style={{ fontSize: "clamp(0.85rem, 1.3vw, 1rem)", fontWeight: 500 }}
          >
            {t("announce.cta")}
          </a>
        )}
      </div>
      <style>{`
        @keyframes announce-pulse {
          0%   { transform: translate(-50%, -50%) scale(0.6); opacity: 0.7; }
          70%  { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
        .announce-dot::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ff9603;
          animation: announce-pulse 1.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .announce-dot::before { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default AnnouncementBanner;
