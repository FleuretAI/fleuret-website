import { describe, expect, it } from "vitest";
import { isQualified } from "@/lib/designPartnerQualify";

describe("isQualified", () => {
  it("qualifies CISO at 100-499 emp", () => {
    expect(isQualified({ role: "ciso", companySize: "100-499" })).toBe(true);
  });

  it("qualifies CTO at 1000+", () => {
    expect(isQualified({ role: "cto", companySize: "1000+" })).toBe(true);
  });

  it("qualifies DPO at 500-999", () => {
    expect(isQualified({ role: "dpo", companySize: "500-999" })).toBe(true);
  });

  it("rejects DevOps lead (wrong role even if right size)", () => {
    expect(isQualified({ role: "devops_lead", companySize: "100-499" })).toBe(false);
  });

  it("rejects <50 company even with CISO", () => {
    expect(isQualified({ role: "ciso", companySize: "<50" })).toBe(false);
  });

  it("rejects 'other' role", () => {
    expect(isQualified({ role: "other", companySize: "100-499" })).toBe(false);
  });
});
