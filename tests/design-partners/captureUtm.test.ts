import { describe, expect, it } from "vitest";
import { captureUtm } from "@/lib/captureUtm";

describe("captureUtm", () => {
  it("returns empty object for blank search", () => {
    expect(captureUtm("")).toEqual({});
  });

  it("extracts all 5 utm keys", () => {
    const s = "?utm_source=linkedin&utm_medium=dm&utm_campaign=dp2026&utm_content=hero&utm_term=pentest";
    expect(captureUtm(s)).toEqual({
      source: "linkedin",
      medium: "dm",
      campaign: "dp2026",
      content: "hero",
      term: "pentest",
    });
  });

  it("ignores unknown keys", () => {
    expect(captureUtm("?utm_source=li&foo=bar")).toEqual({ source: "li" });
  });

  it("caps each value at 120 chars", () => {
    const long = "a".repeat(400);
    const result = captureUtm(`?utm_source=${long}`);
    expect(result.source?.length).toBe(120);
  });
});
