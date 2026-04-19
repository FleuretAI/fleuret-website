import { describe, expect, it } from "vitest";
import { computeParts } from "@/lib/useCountdown";

const target = new Date("2026-06-01T00:00:00+02:00").getTime();

describe("computeParts", () => {
  it("returns expired when now >= target", () => {
    expect(computeParts(target + 1, target)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      expired: true,
    });
    expect(computeParts(target, target)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      expired: true,
    });
  });

  it("computes days/hours/minutes correctly", () => {
    // 3 days, 2 hours, 5 minutes before target
    const delta = (3 * 24 + 2) * 60 * 60 * 1000 + 5 * 60 * 1000;
    expect(computeParts(target - delta, target)).toEqual({
      days: 3,
      hours: 2,
      minutes: 5,
      expired: false,
    });
  });

  it("drops sub-minute remainder", () => {
    const delta = 59 * 1000; // 59 seconds
    const parts = computeParts(target - delta, target);
    expect(parts.expired).toBe(false);
    expect(parts.days).toBe(0);
    expect(parts.hours).toBe(0);
    expect(parts.minutes).toBe(0);
  });
});
