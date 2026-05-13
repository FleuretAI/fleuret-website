import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Props = {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// Watchdog: if useInView never fires (mobile IntersectionObserver quirk
// observed in prod after the global overflow-x change), snap to the final
// value after this many ms so the DOM never reads "0" for a number that
// should render as 247. Slightly longer than the longest in-use duration
// (1.6s) so the animation has a fair shot first.
const COUNTUP_FORCE_MS = 2000;

const CountUp = ({ to, duration = 1.2, prefix = "", suffix = "", separator = "", decimals = 0, className, style }: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReduced = useReducedMotion();
  const [value, setValue] = useState(to);

  useEffect(() => {
    if (prefersReduced) {
      setValue(to);
      return;
    }
    const watchdog = window.setTimeout(() => setValue(to), COUNTUP_FORCE_MS);
    if (!inView) return () => window.clearTimeout(watchdog);
    setValue(0);
    const start = performance.now();
    const durationMs = duration * 1000;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      setValue(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(watchdog);
    };
  }, [inView, prefersReduced, to, duration]);

  const formatted = value.toFixed(decimals);
  const withSep = separator
    ? formatted.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    : formatted;

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{withSep}{suffix}
    </span>
  );
};

export default CountUp;
