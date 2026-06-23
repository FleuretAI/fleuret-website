import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  DEMO_SCHEDULER_EMBED_URL,
  DEMO_SCHEDULER_SHORT_URL,
} from "@/lib/routes";
import { SEO } from "@/seo/SEO";
import { trackEvent, isGtagAvailable } from "@/lib/gtag";

/**
 * /demo route.
 *
 * Two-column layout on desktop, stacked on mobile. Left column carries the
 * value prop, a pullquote, and two trust stats. Right column embeds
 * Augustin's Google appointment scheduler directly so a visitor can book
 * a slot without leaving the site.
 *
 *     ┌──────────────────────────────┬──────────────────────────────┐
 *     │  headline                    │                              │
 *     │  subtitle                    │                              │
 *     │                              │      <iframe scheduler>      │
 *     │  pullquote                   │                              │
 *     │                              │                              │
 *     │  stat 1    |    stat 2       │                              │
 *     └──────────────────────────────┴──────────────────────────────┘
 *                                      "Scheduler not loading? Book directly"
 *
 * Below the iframe a small always-visible fallback line links to the short
 * calendar.app.google URL so iframe blockers (adblockers, strict CSPs)
 * still have a path to booking. Cross-origin iframe load failures are not
 * detectable from JS, so the fallback is shown unconditionally.
 */
const Demo = () => {
  const { t } = useLanguage();

  // Title and description are owned by <SEO pageKey="demo" /> below.
  // Fire the demo-page-view event once gtag is reachable. The bare gtag global
  // is injected by index.html but can race with React mount (observed 8 page
  // views vs 3 demo_page_view events in GA4 week May 18 - Jun 14, 2026 — 62%
  // measurement gap). Poll for up to ~2s so the event lands once the script
  // catches up. The page is funnel-critical, so retry rather than silently miss.
  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const tryFire = () => {
      if (cancelled) return;
      if (isGtagAvailable()) {
        trackEvent("demo_page_view", { page_path: "/demo" });
        return;
      }
      if (attempts++ < 20) setTimeout(tryFire, 100);
    };
    tryFire();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SEO pageKey="demo" />
      <Navbar />

      <main
        id="main-content"
        className="grid-fade"
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "clamp(6rem, 16vw, 12rem)",
          paddingBottom: "clamp(3rem, 8vw, 6rem)",
          flex: 1,
        }}
      >
        {/* Ambient glows (reused from CTASection pattern) */}
        <div
          aria-hidden="true"
          className="hidden md:block"
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 500,
            height: 400,
            background:
              "radial-gradient(ellipse at center, rgba(79,143,255,0.06), transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          className="hidden md:block"
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: 500,
            height: 400,
            background:
              "radial-gradient(ellipse at center, rgba(139,92,246,0.05), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="max-w-[1280px] mx-auto px-4 md:px-8"
          style={{ position: "relative", zIndex: 10 }}
        >
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-start">
            {/* Left column */}
            <div className="flex flex-col gap-8">
              <div>
                <h1
                  style={{
                    fontSize: "clamp(1.875rem, 4.5vw, 3.75rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    marginBottom: "1.25rem",
                  }}
                >
                  <span className="text-gradient-accent">
                    {t("demo.title")}
                  </span>
                </h1>
                <p
                  style={{
                    fontSize: "clamp(1rem, 1.5vw, 1.125rem)",
                    color: "rgba(255,255,255,0.55)",
                    maxWidth: "32rem",
                    lineHeight: 1.7,
                  }}
                >
                  {t("demo.subtitle")}
                </p>
              </div>

              {/* Pullquote (no attribution until a public customer exists) */}
              <blockquote
                style={{
                  borderLeft: "2px solid rgba(255,255,255,0.15)",
                  paddingLeft: "1rem",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  color: "rgba(255,255,255,0.75)",
                  maxWidth: "32rem",
                }}
              >
                {t("demo.pullquote")}
              </blockquote>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-md">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="flex sm:block items-baseline gap-3" style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
                        fontWeight: 300,
                        letterSpacing: "-0.02em",
                        lineHeight: 1,
                        flexShrink: 0,
                      }}
                    >
                      {t(`demo.stat${n}.value`)}
                    </div>
                    <div
                      className="sm:mt-1"
                      style={{
                        fontSize: "0.8125rem",
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: 1.35,
                      }}
                    >
                      {t(`demo.stat${n}.label`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column: scheduler */}
            <div className="flex flex-col gap-3" style={{ minWidth: 0 }}>
              {/*
                Mobile-only fallback CTA, above the iframe. The existing fallback
                line below the iframe is invisible on mobile in practice — the
                520-684px scheduler pushes it off-screen and 0 fallback clicks
                landed across the prior 3 GA4 weeks (~5 /demo visitors/week).
                Surface a visible link before users see the iframe.
              */}
              <a
                href={DEMO_SCHEDULER_SHORT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent("demo_scheduler_fallback_clicked", {
                    destination: DEMO_SCHEDULER_SHORT_URL,
                    placement: "mobile_top",
                  })
                }
                className="md:hidden"
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: "0.9375rem",
                  color: "rgba(255,255,255,0.9)",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 10,
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                }}
              >
                {t("demo.fallback.link")} →
              </a>

              <div
                style={{
                  borderRadius: 16,
                  overflow: "auto",
                  WebkitOverflowScrolling: "touch",
                  background: "#ffffff",
                  padding: 8,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
                  minHeight: 520,
                  maxWidth: "100%",
                }}
              >
                <iframe
                  title={t("demo.iframe.title")}
                  src={DEMO_SCHEDULER_EMBED_URL}
                  loading="lazy"
                  referrerPolicy="origin"
                  style={{
                    border: 0,
                    width: "100%",
                    minHeight: 520,
                    height: "min(80vh, 684px)",
                    display: "block",
                    borderRadius: 10,
                    background: "#ffffff",
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(255,255,255,0.5)",
                  textAlign: "center",
                  marginTop: "0.5rem",
                }}
              >
                {t("demo.fallback.prefix")}{" "}
                <a
                  href={DEMO_SCHEDULER_SHORT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("demo_scheduler_fallback_clicked", {
                      destination: DEMO_SCHEDULER_SHORT_URL,
                    })
                  }
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    textDecoration: "underline",
                  }}
                >
                  {t("demo.fallback.link")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Demo;
