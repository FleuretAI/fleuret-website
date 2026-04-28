import { describe, expect, it } from "vitest";
import {
  POC_PRICE_EUR,
  RECURRING_PRICE_EUR_1YR,
  RECURRING_PRICE_EUR_3YR,
  MULTI_YEAR_DISCOUNT_PCT,
  MULTI_YEAR_LOCK_YEARS,
  WHOLESALE_RATE_GRC_PCT,
  WHOLESALE_RATE_MARKETPLACE_PCT,
  POC_TO_RECURRING_CREDIT_WINDOW_MONTHS,
  computeMultiYearPrice,
  computeWholesalePrice,
  computeUpgradeCredit,
} from "@/lib/pricingConfig";

describe("pricingConfig — constants", () => {
  it("POC list price is €3,000", () => {
    expect(POC_PRICE_EUR).toBe(3000);
  });

  it("Recurring 1yr list is €30,000", () => {
    expect(RECURRING_PRICE_EUR_1YR).toBe(30000);
  });

  it("Recurring 3yr list is €27,000", () => {
    expect(RECURRING_PRICE_EUR_3YR).toBe(27000);
  });

  it("multi-year discount is 10%", () => {
    expect(MULTI_YEAR_DISCOUNT_PCT).toBe(10);
  });

  it("multi-year lock is 3 years", () => {
    expect(MULTI_YEAR_LOCK_YEARS).toBe(3);
  });

  it("SaaS GRC wholesale rate is 50%", () => {
    expect(WHOLESALE_RATE_GRC_PCT).toBe(50);
  });

  it("marketplace wholesale rate is 60%", () => {
    expect(WHOLESALE_RATE_MARKETPLACE_PCT).toBe(60);
  });

  it("POC → Recurring credit window is 6 months", () => {
    expect(POC_TO_RECURRING_CREDIT_WINDOW_MONTHS).toBe(6);
  });

  it("Recurring 3yr equals 1yr minus the configured discount", () => {
    // Cross-config invariant: the 3yr list must derive from the 1yr list
    // using the documented discount rate. If anyone bumps one without
    // touching the other, this test breaks loudly.
    expect(computeMultiYearPrice(RECURRING_PRICE_EUR_1YR)).toBe(
      RECURRING_PRICE_EUR_3YR,
    );
  });
});

describe("computeMultiYearPrice", () => {
  it("applies 10% discount on €30,000 → €27,000", () => {
    expect(computeMultiYearPrice(30000)).toBe(27000);
  });

  it("returns 0 for 0 input", () => {
    expect(computeMultiYearPrice(0)).toBe(0);
  });

  it("rounds correctly on non-flat numbers", () => {
    expect(computeMultiYearPrice(12345)).toBe(11110.5);
  });

  it("throws on negative input", () => {
    expect(() => computeMultiYearPrice(-1)).toThrow();
  });
});

describe("computeWholesalePrice", () => {
  it("SaaS GRC wholesale on €30,000 is €15,000", () => {
    expect(computeWholesalePrice(30000, "saas-grc")).toBe(15000);
  });

  it("marketplace wholesale on €3,000 is €1,800", () => {
    expect(computeWholesalePrice(3000, "marketplace")).toBe(1800);
  });

  it("returns 0 for 0 input", () => {
    expect(computeWholesalePrice(0, "saas-grc")).toBe(0);
    expect(computeWholesalePrice(0, "marketplace")).toBe(0);
  });

  it("throws on negative input", () => {
    expect(() => computeWholesalePrice(-1, "saas-grc")).toThrow();
  });

  it("throws on unknown partner type", () => {
    // @ts-expect-error: deliberate runtime check
    expect(() => computeWholesalePrice(30000, "enterprise")).toThrow();
  });
});

describe("computeUpgradeCredit", () => {
  it("POC €3,000 credits against Recurring year 1 €30,000 → €27,000", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 3000, recurringYear1Eur: 30000 }),
    ).toBe(27000);
  });

  it("3 webapp POCs (€9,000) credit against Recurring year 1 → €21,000", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 9000, recurringYear1Eur: 30000 }),
    ).toBe(21000);
  });

  it("returns the full Recurring price when no POC was paid", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 0, recurringYear1Eur: 30000 }),
    ).toBe(30000);
  });

  it("throws when POC credit would exceed Recurring year 1", () => {
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: 50000, recurringYear1Eur: 30000 }),
    ).toThrow();
  });

  it("throws on negative input", () => {
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: -1, recurringYear1Eur: 30000 }),
    ).toThrow();
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: 0, recurringYear1Eur: -1 }),
    ).toThrow();
  });
});
