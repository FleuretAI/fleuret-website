/**
 * Design Partner program parameters. Single source of truth used by the page,
 * the countdown, the copy, the schema, and the tests. Update here when cohort
 * changes, never hardcode dates or prices in components.
 */
import { POC_PRICE_EUR } from "./pricingConfig";

export const DP_TOTAL_SLOTS = 5;
export const DP_PRICE_EUR = 4900;
export const DP_PILOT_WEEKS = 6;
export const DP_PENTESTS_INCLUDED = 3;

/**
 * Retail equivalent for the bundle the DP cohort buys: 3 webapp POCs at the
 * standard POC list price. Used in DP copy to anchor the discount value.
 * Cross-config invariant: DP_RETAIL_EQUIVALENT_EUR must equal
 * DP_PENTESTS_INCLUDED * POC_PRICE_EUR (enforced by tests).
 */
export const DP_RETAIL_EQUIVALENT_EUR = DP_PENTESTS_INCLUDED * POC_PRICE_EUR;

// 2026-06-01 00:00 Europe/Paris is UTC+2 in June (CEST).
export const DP_COHORT_START_ISO = "2026-05-31T22:00:00.000Z";

export const DP_COHORT_VISIBLE: boolean =
  (import.meta.env?.VITE_COHORT_VISIBLE ?? "true") !== "false";
