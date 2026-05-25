import { describe, expect, it } from "vitest";
import {
  DP_TOTAL_SLOTS,
  DP_PRICE_EUR,
  DP_PILOT_WEEKS,
  DP_PENTESTS_INCLUDED,
  DP_RETAIL_EQUIVALENT_EUR,
} from "@/lib/designPartnerConfig";
import { POC_PRICE_EUR } from "@/lib/pricingConfig";

describe("designPartnerConfig — constants", () => {
  it("DP_TOTAL_SLOTS is 5", () => {
    expect(DP_TOTAL_SLOTS).toBe(5);
  });

  it("DP_PRICE_EUR is €4,900 (cohort flat fee)", () => {
    expect(DP_PRICE_EUR).toBe(4900);
  });

  it("DP_PILOT_WEEKS is 6", () => {
    expect(DP_PILOT_WEEKS).toBe(6);
  });

  it("DP_PENTESTS_INCLUDED is 3", () => {
    expect(DP_PENTESTS_INCLUDED).toBe(3);
  });
});

describe("designPartnerConfig — cross-config invariant with pricingConfig", () => {
  it("DP_RETAIL_EQUIVALENT_EUR equals DP_PENTESTS_INCLUDED * POC_PRICE_EUR", () => {
    expect(DP_RETAIL_EQUIVALENT_EUR).toBe(DP_PENTESTS_INCLUDED * POC_PRICE_EUR);
  });

  it("DP_RETAIL_EQUIVALENT_EUR is currently €9,000 (3 × €3,000)", () => {
    expect(DP_RETAIL_EQUIVALENT_EUR).toBe(9000);
  });

  it("DP_PRICE_EUR is below DP_RETAIL_EQUIVALENT_EUR (cohort is genuinely a discount)", () => {
    expect(DP_PRICE_EUR).toBeLessThan(DP_RETAIL_EQUIVALENT_EUR);
  });
});
