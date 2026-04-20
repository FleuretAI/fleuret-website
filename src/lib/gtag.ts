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
