import { describe, it, expect } from "vitest";
import { translations } from "@/contexts/LanguageContext";

const requiredKeywords: Record<string, { fr: string[]; en: string[] }> = {
  "process.main.title": { fr: ["pentest"], en: ["pentest"] },
  "pricing.title.main": { fr: ["pentest"], en: [] },
  "pricing.title.accent": { fr: [], en: ["pentest"] },
  "about.hero.highlight": { fr: ["pentest"], en: ["pentest"] },
  "resources.hero.title": { fr: ["pentest"], en: ["pentest"] },
  "hero.title.line1": { fr: [], en: [] },
  "hero.title.line2": { fr: [], en: [] },
};

describe("heading SEO regression", () => {
  for (const [key, { fr, en }] of Object.entries(requiredKeywords)) {
    it(`FR ${key} present and contains required keywords`, () => {
      const value = (translations.fr as Record<string, string>)[key];
      expect(value, `FR translation missing for ${key}`).toBeTruthy();
      for (const kw of fr) {
        expect(value.toLowerCase()).toContain(kw.toLowerCase());
      }
    });

    it(`EN ${key} present and contains required keywords`, () => {
      const value = (translations.en as Record<string, string>)[key];
      expect(value, `EN translation missing for ${key}`).toBeTruthy();
      for (const kw of en) {
        expect(value.toLowerCase()).toContain(kw.toLowerCase());
      }
    });
  }
});
