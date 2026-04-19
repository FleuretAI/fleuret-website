import { useEffect, useState } from "react";
import { DP_TOTAL_SLOTS } from "./designPartnerConfig";

export interface SlotsState {
  remaining: number;
  total: number;
  loading: boolean;
  fallback: boolean;
}

/**
 * Fetches the live slot count from /api/slots. Returns the hardcoded total
 * while loading and on error so the page never shows "0 of 0 left."
 * Guarded against puppeteer prerender via typeof window check.
 */
export function useSlots(): SlotsState {
  const [state, setState] = useState<SlotsState>({
    remaining: DP_TOTAL_SLOTS,
    total: DP_TOTAL_SLOTS,
    loading: true,
    fallback: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    fetch("/api/slots", { headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (cancelled) return;
        const remaining = Number.isFinite(data?.remaining)
          ? Math.max(0, Math.min(DP_TOTAL_SLOTS, data.remaining))
          : DP_TOTAL_SLOTS;
        setState({
          remaining,
          total: DP_TOTAL_SLOTS,
          loading: false,
          fallback: Boolean(data?.fallback),
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          remaining: DP_TOTAL_SLOTS,
          total: DP_TOTAL_SLOTS,
          loading: false,
          fallback: true,
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
