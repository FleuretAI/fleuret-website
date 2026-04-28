/**
 * Pricing parameters. Single source of truth used by the pricing page,
 * the i18n strings, the partner deck math, and the tests. Update here when
 * pricing changes, never hardcode prices in components.
 *
 * Two SKUs:
 *   POC      — €3,000 per webapp, upfront, one-time. Land SKU.
 *   Recurring — €30,000 per year (1yr) or €27,000 per year (3yr lock).
 *
 * Channel wholesale (the percentage of list that Fleuret receives —
 * partner keeps the remainder as their markup):
 *   SaaS GRC partners (Vanta, Sprinto, Drata, etc.): 50% of Recurring list
 *     to Fleuret (€15,000 / year on €30,000 list).
 *   Marketplace partners (Yogosha, etc.): 60% of POC list to Fleuret
 *     (€1,800 per pentest on €3,000 list).
 *
 * Conversion lever:
 *   POC fee credits in full toward year 1 of Recurring if the customer upgrades
 *   within 6 months. Removes the "I already paid" objection at upsell time.
 */

export const POC_PRICE_EUR = 3000;
export const RECURRING_PRICE_EUR_1YR = 30000;
export const RECURRING_PRICE_EUR_3YR = 27000;

export const MULTI_YEAR_DISCOUNT_PCT = 10;
export const MULTI_YEAR_LOCK_YEARS = 3;

/** Fleuret's share of list price (partner keeps the remainder). */
export const WHOLESALE_RATE_GRC_PCT = 50;
export const WHOLESALE_RATE_MARKETPLACE_PCT = 60;

export const POC_TO_RECURRING_CREDIT_WINDOW_MONTHS = 6;

export type PartnerType = "saas-grc" | "marketplace";
export type RecurringTerm = "1yr" | "3yr";

/**
 * Compute the multi-year price per year given the 1yr list and lock years.
 * Returns the annual rate AFTER the multi-year discount is applied.
 *
 * Example: computeMultiYearPrice(30000) === 27000
 */
export function computeMultiYearPrice(annualPriceEur: number): number {
  if (annualPriceEur < 0) {
    throw new Error("annualPriceEur must be non-negative");
  }
  return Math.round(annualPriceEur * (100 - MULTI_YEAR_DISCOUNT_PCT)) / 100;
}

/**
 * Compute the wholesale price Fleuret receives from a channel partner.
 * The constant `WHOLESALE_RATE_*_PCT` is Fleuret's share of list (partner keeps
 * the remainder as their markup). The partner sets retail freely on top.
 *
 * Example: computeWholesalePrice(30000, "saas-grc") === 15000   (50% of 30k)
 *          computeWholesalePrice(3000, "marketplace") === 1800  (60% of 3k)
 */
export function computeWholesalePrice(
  listPriceEur: number,
  partnerType: PartnerType,
): number {
  if (listPriceEur < 0) {
    throw new Error("listPriceEur must be non-negative");
  }
  const sharePct =
    partnerType === "saas-grc"
      ? WHOLESALE_RATE_GRC_PCT
      : partnerType === "marketplace"
        ? WHOLESALE_RATE_MARKETPLACE_PCT
        : null;
  if (sharePct === null) {
    throw new Error(`Unknown partnerType: ${String(partnerType)}`);
  }
  return Math.round(listPriceEur * sharePct) / 100;
}

/**
 * Compute the upgrade credit a customer receives when converting from POC
 * to Recurring within the credit window. Returns the year-1 Recurring price
 * after applying the POC credit.
 *
 * Example: computeUpgradeCredit({ pocPaidEur: 3000, recurringYear1Eur: 30000 }) === 27000
 */
export function computeUpgradeCredit(args: {
  pocPaidEur: number;
  recurringYear1Eur: number;
}): number {
  const { pocPaidEur, recurringYear1Eur } = args;
  if (pocPaidEur < 0 || recurringYear1Eur < 0) {
    throw new Error("Inputs must be non-negative");
  }
  if (pocPaidEur > recurringYear1Eur) {
    throw new Error("POC credit cannot exceed Recurring year 1 price");
  }
  return recurringYear1Eur - pocPaidEur;
}
