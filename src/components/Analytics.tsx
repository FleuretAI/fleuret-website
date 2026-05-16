import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  trackOutboundClick,
  trackPageView,
  trackScrollDepth,
} from "@/lib/gtag";

const STORAGE_KEY = "fleuret_cookie_consent";
const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

type ClarityFn = (...args: unknown[]) => void;
type WindowWithClarity = typeof window & { clarity?: ClarityFn };

/** Upgrade Clarity to cookie-based tracking once the visitor accepts cookies.
 *  No-op when Clarity is missing (script blocked, ad-blocker, SSR). */
function grantClarityConsent(): void {
  try {
    if (typeof window === "undefined") return;
    (window as WindowWithClarity).clarity?.("consent");
  } catch {
    // Never let analytics throw into product code.
  }
}

/**
 * Bridges the cookie banner to GA4 Consent Mode v2 and tracks SPA page_views.
 *
 * Why this exists:
 *  - `index.html` boots gtag with `analytics_storage: 'denied'`. Without this
 *    bridge, `granted` never fires, so accepted users stay in cookieless ping
 *    mode forever (data loss, no attribution, empty Insights).
 *  - React Router does not auto-fire `page_view` on client-side nav. Only the
 *    initial HTML load is counted; every subsequent route is invisible to GA4.
 *
 * Mounted once inside BrowserRouter, renders nothing.
 */
const Analytics = () => {
  const { pathname, search } = useLocation();
  const firstRun = useRef(true);

  // Consent bridge: replay stored choice on mount + listen for banner events.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "accepted") {
      grantAnalyticsConsent();
      grantClarityConsent();
    }

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<"accepted" | "denied">).detail;
      if (detail === "accepted") {
        grantAnalyticsConsent();
        grantClarityConsent();
      } else if (detail === "denied") {
        denyAnalyticsConsent();
      }
    };
    window.addEventListener("cookie-consent", onConsent);
    return () => window.removeEventListener("cookie-consent", onConsent);
  }, []);

  // SPA page_view: skip the first render (gtag config already fired one on
  // initial load), then fire on every subsequent route change.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    trackPageView(pathname + search);
  }, [pathname, search]);

  // Outbound-click delegate: one capture-phase listener on document beats
  // tagging every <a> manually. Fires for any link to a different host.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.host === window.location.host) return;
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      trackOutboundClick(url.href, anchor.textContent?.trim() || undefined);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  // Scroll depth: fire 25/50/75/100 once per page. Reset on route change so a
  // long Resources article counts separately from the homepage.
  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
      for (const m of SCROLL_MILESTONES) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          trackScrollDepth(m);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
};

export default Analytics;
