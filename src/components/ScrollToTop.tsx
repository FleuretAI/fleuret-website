import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Browser default: restore the prior scroll position on refresh / back-nav.
// Set once at module-load so it applies before any route-change useEffect runs.
// Manual lets us own scroll position (route changes + refresh both land on top).
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  // On first mount (refresh or initial nav) force a top scroll once paint
  // settles, defeating any latent browser auto-restore that ran before us.
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const raf = requestAnimationFrame(() => {
      if (window.scrollY !== 0) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default ScrollToTop;
