import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  trackPageView,
} from "@/lib/gtag";

const STORAGE_KEY = "fleuret_cookie_consent";

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
    }

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<"accepted" | "denied">).detail;
      if (detail === "accepted") grantAnalyticsConsent();
      else if (detail === "denied") denyAnalyticsConsent();
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

  return null;
};

export default Analytics;
