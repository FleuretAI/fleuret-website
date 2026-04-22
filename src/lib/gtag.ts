/**
 * Typed wrapper around the GA4 `gtag` global injected by `index.html`.
 *
 * Guards `window`/`gtag` access so SSR + the prerender pipeline
 * (`scripts/prerender.mjs` → puppeteer-core + `@sparticuz/chromium`) do not
 * crash. Returns silently when GA is unavailable, denied by Consent Mode, or
 * blocked by an extension. GA4 itself drops events when consent is "denied",
 * so the hot path stays a no-op without us reimplementing consent logic.
 */

export type GtagFn = (
  command: "event" | "config" | "set" | "consent",
  action: string,
  params?: Record<string, unknown>,
) => void;

type WindowWithGtag = typeof window & { gtag?: GtagFn };

/** True when running in a browser with `window.gtag` exposed. */
export function isGtagAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return typeof (window as WindowWithGtag).gtag === "function";
}

/** Fire a GA4 event. No-op when not in a browser or when gtag is missing. */
export function trackEvent(
  action: string,
  params?: Record<string, unknown>,
): void {
  if (!isGtagAvailable()) return;
  try {
    (window as WindowWithGtag).gtag!("event", action, params);
  } catch {
    // Never let analytics throw into product code.
  }
}

/**
 * Upgrade GA4 Consent Mode v2 from the default "denied" state to "granted" for
 * analytics. Called after the user accepts the cookie banner. GA4 backfills any
 * buffered pings from the pre-consent window once this fires.
 */
export function grantAnalyticsConsent(): void {
  if (!isGtagAvailable()) return;
  try {
    (window as WindowWithGtag).gtag!("consent", "update", {
      analytics_storage: "granted",
    });
  } catch {
    // no-op
  }
}

/** Revoke analytics consent back to denied. Called when the user clicks Refuse. */
export function denyAnalyticsConsent(): void {
  if (!isGtagAvailable()) return;
  try {
    (window as WindowWithGtag).gtag!("consent", "update", {
      analytics_storage: "denied",
    });
  } catch {
    // no-op
  }
}

/**
 * Fire a GA4 `page_view` for SPA route transitions. React Router does not
 * trigger one automatically; without this, only the initial HTML load is
 * counted and every subsequent client-side navigation is invisible to GA4.
 */
export function trackPageView(path: string, title?: string): void {
  if (!isGtagAvailable()) return;
  try {
    (window as WindowWithGtag).gtag!("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: title ?? document.title,
    });
  } catch {
    // no-op
  }
}
