import { useEffect } from "react";

/**
 * Drops a `data-{flag}="true"` attribute on <html> after mount. Used as a
 * sentinel inside a Suspense boundary so the prerender script
 * (scripts/prerender.mjs) knows all lazy children have resolved before it
 * snapshots the DOM. Returns null — renders nothing, costs zero pixels.
 *
 * Without this marker, lazy-loaded route compositions ship Suspense
 * fallbacks (typically empty) into the static HTML, which kills SEO for
 * below-the-fold content.
 */
type Props = { flag: string };

export function PrerenderMarker({ flag }: Props) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset[flag] = "true";
    return () => {
      // Clear on unmount so SPA route changes can re-arm the marker if a
      // future page reuses it. Harmless on the homepage (mounted once).
      delete document.documentElement.dataset[flag];
    };
  }, [flag]);
  return null;
}
