import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { mountHeroCanvas } from "@/lib/heroCanvas";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";
import stoikLogo from "@/assets/investors/stoik.svg";

type TrustLogo = {
  name: string;
  logo: string;
  href: string;
  /** Set true to invert dark-on-light artwork so it reads on the dark hero. */
  invert?: boolean;
  /** Visual height in px at the largest breakpoint. */
  heightPx?: number;
};

const TRUST_LOGOS: TrustLogo[] = [
  { name: "Stoïk", logo: stoikLogo, href: "https://www.stoik.io/", invert: true, heightPx: 22 },
];

const Hero = () => {
  const { t, localize } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = mountHeroCanvas(canvasRef.current);
    return cleanup;
  }, []);

  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100dvh", isolation: "isolate" }}
    >
      {/* Ambient glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "22%", left: "18%", width: 760, height: 760,
          background: "radial-gradient(ellipse at center, rgba(79,143,255,0.09), transparent 70%)",
          filter: "blur(10px)",
          animation: "float1 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "15%", right: "14%", width: 680, height: 680,
          background: "radial-gradient(ellipse at center, rgba(139,92,246,0.08), transparent 70%)",
          filter: "blur(10px)",
          animation: "float2 22s ease-in-out infinite",
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 2,
          maskImage: [
            "radial-gradient(ellipse 55% 110% at 0% 50%, #000 10%, transparent 75%)",
            "radial-gradient(ellipse 55% 110% at 100% 50%, #000 10%, transparent 75%)",
            "radial-gradient(ellipse 90% 65% at 50% 50%, transparent 42%, #000 82%)",
          ].join(", "),
          maskComposite: "add",
          WebkitMaskImage: [
            "radial-gradient(ellipse 55% 110% at 0% 50%, #000 10%, transparent 75%)",
            "radial-gradient(ellipse 55% 110% at 100% 50%, #000 10%, transparent 75%)",
            "radial-gradient(ellipse 90% 65% at 50% 50%, transparent 42%, #000 82%)",
          ].join(", "),
        }}
      />

      {/* Vignette behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: "radial-gradient(ellipse 42% 38% at 50% 50%, rgba(15,16,28,0.7) 0%, rgba(15,16,28,0.35) 45%, rgba(15,16,28,0) 75%)",
        }}
      />

      {/* Text content */}
      <div className="container mx-auto px-4 relative" style={{ zIndex: 10 }}>
        <div
          className="max-w-4xl mx-auto text-center px-2"
          style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
        >
          <h1
            style={{
              fontSize: "clamp(1.375rem, 6vw, 4.5rem)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              marginBottom: "1.75rem",
            }}
          >
            <span
              className="block"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #ffffff 35%, rgba(255,255,255,0.55) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("hero.title.line1")}
            </span>
            <span
              className="block"
              style={{
                background: "linear-gradient(135deg, #4f8fff 0%, #8b5cf6 55%, #ef4444 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {t("hero.title.line2")}
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(0.8125rem, 1.6vw, 1.25rem)",
              fontWeight: 300,
              maxWidth: "42rem",
              margin: "0 auto 2rem",
              lineHeight: 1.7,
              background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.45) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t("hero.subtitle")}
          </p>

          <div style={{ display: "flex", justifyContent: "center", paddingTop: "1rem" }}>
            <Link to={localize(DEMO_ROUTE)} className="btn-cta btn-cta--lg">
              {t("hero.cta")}
            </Link>
          </div>

          {TRUST_LOGOS.length > 0 && (
            <div
              aria-label={t("clients.title")}
              className="mt-12 sm:mt-14 flex flex-col items-center gap-4 sm:gap-5"
            >
              <span
                className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-white/40"
              >
                {t("clients.title")}
              </span>
              <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 sm:gap-x-14">
                {TRUST_LOGOS.map((c) => (
                  <li key={c.name}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={c.name}
                      className="block opacity-60 transition-opacity duration-300 hover:opacity-95 focus-visible:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400 rounded-sm"
                    >
                      <img
                        src={c.logo}
                        alt={c.name}
                        loading="lazy"
                        decoding="async"
                        style={{ height: `${c.heightPx ?? 22}px` }}
                        className={`w-auto select-none ${c.invert ? "invert brightness-0" : ""}`}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
