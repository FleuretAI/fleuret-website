import { useEffect, useRef } from "react";
import { mountHeroCanvas } from "@/lib/heroCanvas";
import { useLanguage } from "@/contexts/LanguageContext";


const DEMO_URL = "https://calendar.app.google/H9GMsaSvZMhwRbueA";

const Hero = () => {
  const { t } = useLanguage();
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
          {/* Announcement badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
            <div
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1.1rem",
                borderRadius: "1rem",
                border: "1px solid rgba(79,143,255,0.25)",
                background: "rgba(79,143,255,0.08)",
                backdropFilter: "blur(8px)",
                maxWidth: "min(88vw, 480px)",
                textAlign: "center",
              }}
              className="sm:flex-row sm:rounded-full sm:py-[0.375rem] sm:pl-[0.5rem] sm:pr-[1rem] sm:gap-[0.625rem]"
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "0.2rem 0.7rem",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {t("hero.badge.label")}
              </span>
              <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", letterSpacing: "0.01em", lineHeight: 1.4 }}>
                {t("hero.badge.text")}
              </span>
            </div>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.25rem, 6vw, 4.5rem)",
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
              fontSize: "clamp(1rem, 1.6vw, 1.25rem)",
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
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "1rem",
                fontWeight: 500,
                padding: "0.875rem 2.5rem",
                borderRadius: "999px",
                color: "#fff",
                background: "linear-gradient(135deg, #4f8fff, #8b5cf6)",
                transition: "box-shadow 0.2s, transform 0.15s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(79,143,255,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
            >
              {t("hero.cta")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
