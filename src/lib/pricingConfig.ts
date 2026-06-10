/**
 * Pricing parameters. Single source of truth.
 *
 * Public page = product-led, per-test façade (mirrors the category leader's
 * structure without naming it):
 *   Pentest          — €4,000 per test. Standard surface, ~2-week manual depth.
 *   Advanced Pentest — €8,000 per test. Complex apps, ~4-week manual depth.
 *   Continuous       — quote. Unlimited coverage, weekly rescan, the recurring moat.
 *
 * POC (€3,000) is no longer a public card — it folds into a credit: a first
 * test credits toward the continuous subscription. The credit mechanic stays
 * here because sales still uses it.
 *
 * The internal credit / engagement-posture / lever model (Augustin's pricing
 * architecture) lives on the channel side, never on the public page.
 *
 * Channel wholesale (Fleuret's share of list):
 *   SaaS GRC partners: 50%
 *   Marketplace partners: 60%
 */

export const POC_PRICE_EUR = 3000;

export const PENTEST_PRICE_EUR = 4000;
export const ADVANCED_PENTEST_PRICE_EUR = 8000;

export const WHOLESALE_RATE_GRC_PCT = 50;
export const WHOLESALE_RATE_MARKETPLACE_PCT = 60;

export const POC_TO_RECURRING_CREDIT_WINDOW_MONTHS = 6;

export type PartnerType = "saas-grc" | "marketplace";
export type TierKey = "pentest" | "advanced" | "continuous";

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

export function computeUpgradeCredit(args: {
  pocPaidEur: number;
  tierYear1Eur: number;
}): number {
  const { pocPaidEur, tierYear1Eur } = args;
  if (pocPaidEur < 0 || tierYear1Eur < 0) {
    throw new Error("Inputs must be non-negative");
  }
  if (pocPaidEur > tierYear1Eur) {
    throw new Error("POC credit cannot exceed tier year 1 price");
  }
  return tierYear1Eur - pocPaidEur;
}
