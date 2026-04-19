import { useEffect, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  expired: boolean;
}

export function computeParts(nowMs: number, targetMs: number): CountdownParts {
  const diff = targetMs - nowMs;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, expired: true };
  }
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const days = Math.floor(diff / day);
  const hours = Math.floor((diff % day) / hour);
  const minutes = Math.floor((diff % hour) / minute);
  return { days, hours, minutes, expired: false };
}

/**
 * Ticks every 60 seconds. Day/hour/minute only — no seconds (jitter + perf).
 * Safe for puppeteer prerender: no render on server (initial value from target).
 */
export function useCountdown(targetIsoUtc: string): CountdownParts {
  const targetMs = new Date(targetIsoUtc).getTime();
  const [parts, setParts] = useState<CountdownParts>(() =>
    computeParts(Date.now(), targetMs),
  );

  useEffect(() => {
    if (parts.expired) return;
    const tick = () => setParts(computeParts(Date.now(), targetMs));
    tick();
    const id = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(id);
  }, [targetMs, parts.expired]);

  return parts;
}
