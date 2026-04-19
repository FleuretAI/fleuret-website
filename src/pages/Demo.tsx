import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SEO } from "@/seo/SEO";
import {
  DEMO_SCHEDULER_EMBED_URL,
  DEMO_SCHEDULER_SHORT_URL,
} from "@/lib/routes";

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

  useEffect(() => {
    const prevTitle = document.title;
    const descMeta = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    const prevDesc = descMeta?.content ?? null;

    document.title = t("demo.pageTitle");
    if (descMeta) descMeta.content = t("demo.pageDescription");

    // Fire analytics event. gtag is queued under consent-denied default
    // and dispatched only after consent is granted, so this is safe to
    // call unconditionally (no-op when gtag is not present).
    type GtagFn = (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
    const w = window as typeof window & { gtag?: GtagFn };
    if (typeof w.gtag === "function") {
      w.gtag("event", "demo_page_view", { page_path: "/demo" });
    }

    return () => {
      document.title = prevTitle;
      if (descMeta && prevDesc !== null) descMeta.content = prevDesc;
    };
  }, [t]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SEO pageKey="demo" />
      <Navbar />

      <main
        className="grid-fade"
        style={{
          position: "relative",
          overflow: "hidden",
          paddingTop: "8rem",
          paddingBottom: "6rem",
          flex: 1,
        }}
      >
        {/* Ambient glows (reused from CTASection pattern) */}
        <div
          aria-hidden="true"
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
              <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-md">
                {[1, 2, 3].map((n) => (
                  <div key={n}>
                    <div
                      style={{
                        fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                        fontWeight: 300,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {t(`demo.stat${n}.value`)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: "rgba(255,255,255,0.5)",
                        marginTop: "0.25rem",
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
            <div className="flex flex-col gap-3">
              <div
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "#ffffff",
                  padding: 8,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
                  minHeight: 600,
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
                    minHeight: 584,
                    height: 684,
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
