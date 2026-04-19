import { describe, expect, it } from "vitest";
import { applicationSchema } from "@/lib/designPartnerSchema";

const base = {
  email: "ciso@example.com",
  role: "ciso" as const,
  companySize: "100-499" as const,
  primaryAsset: "SaaS B2B platform + partner API",
  consent: true as const,
  submissionId: "6f0a0c28-8a8a-4d4b-a0a0-1111aaaa2222",
};

describe("applicationSchema", () => {
  it("accepts a valid CISO application", () => {
    const parsed = applicationSchema.parse(base);
    expect(parsed.email).toBe("ciso@example.com");
    expect(parsed.role).toBe("ciso");
  });

  it("lowercases + trims email", () => {
    const parsed = applicationSchema.parse({ ...base, email: "  CISO@Example.com " });
    expect(parsed.email).toBe("ciso@example.com");
  });

  it("rejects missing consent", () => {
    expect(() =>
      applicationSchema.parse({ ...base, consent: false as unknown as true }),
    ).toThrow();
  });

  it("rejects empty primaryAsset (< 3 chars)", () => {
    expect(() => applicationSchema.parse({ ...base, primaryAsset: "ok" })).toThrow();
  });

  it("caps primaryAsset at 280 chars", () => {
    const long = "a".repeat(400);
    expect(() => applicationSchema.parse({ ...base, primaryAsset: long })).toThrow();
  });

  it("rejects unknown role", () => {
    expect(() =>
      applicationSchema.parse({ ...base, role: "intern" as unknown as "ciso" }),
    ).toThrow();
  });

  it("rejects invalid submissionId (not a UUID)", () => {
    expect(() =>
      applicationSchema.parse({ ...base, submissionId: "not-a-uuid" }),
    ).toThrow();
  });

  it("accepts optional utm + referrer", () => {
    const parsed = applicationSchema.parse({
      ...base,
      utm: { source: "linkedin", medium: "dm", campaign: "dp-2026" },
      referrer: "https://linkedin.com/in/example",
      locale: "fr",
    });
    expect(parsed.utm?.source).toBe("linkedin");
    expect(parsed.locale).toBe("fr");
  });
});
