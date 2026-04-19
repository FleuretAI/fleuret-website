/**
 * Design Partner program parameters. Single source of truth used by the page,
 * the countdown, the copy, the schema, and the tests. Update here when cohort
 * changes, never hardcode dates or prices in components.
 */
export const DP_TOTAL_SLOTS = 5;
export const DP_PRICE_EUR = 4900;
export const DP_PILOT_WEEKS = 6;
export const DP_PENTESTS_INCLUDED = 3;

// 2026-06-01 00:00 Europe/Paris is UTC+2 in June (CEST).
export const DP_COHORT_START_ISO = "2026-05-31T22:00:00.000Z";

export const DP_COHORT_VISIBLE: boolean =
  (import.meta.env?.VITE_COHORT_VISIBLE ?? "true") !== "false";
