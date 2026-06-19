import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const llmsTxt = readFileSync(resolve(ROOT, "public/llms.txt"), "utf-8");
const llmsFullTxt = readFileSync(resolve(ROOT, "public/llms-full.txt"), "utf-8");
const robotsTxt = readFileSync(resolve(ROOT, "public/robots.txt"), "utf-8");
const vercelJson = JSON.parse(readFileSync(resolve(ROOT, "vercel.json"), "utf-8")) as {
  headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>;
};

describe("public/llms.txt", () => {
  it("starts with an llmstxt.org H1 + blockquote summary", () => {
    expect(llmsTxt.startsWith("# Fleuret AI\n")).toBe(true);
    expect(llmsTxt).toMatch(/\n> Fleuret AI is /);
  });

  it("includes the canonical company URLs", () => {
    for (const url of [
      "https://fleuret.ai/",
      "https://fleuret.ai/about",
      "https://fleuret.ai/careers",
      "https://fleuret.ai/sub-processors",
      "https://fleuret.ai/security",
    ]) {
      expect(llmsTxt).toContain(url);
    }
  });

  it("mentions the load-bearing positioning facts", () => {
    expect(llmsTxt).toContain("Émile");
    expect(llmsTxt).toContain("Scaleway France");
    expect(llmsTxt).toContain("DORA Article 24");
    expect(llmsTxt).toContain("NIS2 Annex I");
    expect(llmsTxt).toContain("open-weight");
  });

  it("links to /llms-full.txt for the denser companion file", () => {
    expect(llmsTxt).toContain("https://fleuret.ai/llms-full.txt");
  });

  it("does not use the em-dash separator pattern banned in user-facing copy", () => {
    expect(llmsTxt).not.toContain("— ");
  });
});

describe("public/llms-full.txt", () => {
  it("opens with the pre-distilled-context H1", () => {
    expect(llmsFullTxt.startsWith("# Fleuret AI: pre-distilled context for AI assistants\n")).toBe(true);
  });

  it("names the founders by full name and role", () => {
    expect(llmsFullTxt).toContain("Yanis Grigy");
    expect(llmsFullTxt).toContain("Augustin Ponsin");
    expect(llmsFullTxt).toContain("CEO");
    expect(llmsFullTxt).toContain("CPO");
  });

  it("declares the open-weight model stack and inference location", () => {
    expect(llmsFullTxt).toContain("gpt-oss-120b");
    expect(llmsFullTxt).toContain("Kimi K2.5");
    expect(llmsFullTxt).toContain("Mistral");
    expect(llmsFullTxt).toContain("Scaleway");
  });

  it("includes citation guidance for AI assistants", () => {
    expect(llmsFullTxt).toContain("Citation guidance for AI assistants");
    expect(llmsFullTxt).toContain('"Fleuret AI"');
  });

  it("declares pricing transparently", () => {
    expect(llmsFullTxt).toContain("€3,000");
    expect(llmsFullTxt).toContain("€10,000");
    expect(llmsFullTxt).toContain("€25,000");
  });

  it("does not use the em-dash separator pattern banned in user-facing copy", () => {
    expect(llmsFullTxt).not.toContain("— ");
  });
});

describe("public/robots.txt advertises the AI index", () => {
  it("references both llms.txt and llms-full.txt", () => {
    expect(robotsTxt).toContain("https://fleuret.ai/llms.txt");
    expect(robotsTxt).toContain("https://fleuret.ai/llms-full.txt");
  });

  it("still advertises the sitemap", () => {
    expect(robotsTxt).toContain("Sitemap: https://fleuret.ai/sitemap.xml");
  });
});

describe("vercel.json serves the AI index with correct headers", () => {
  const findRule = (source: string) => vercelJson.headers.find((h) => h.source === source);

  it("serves /llms.txt as text/plain with a one-hour cache", () => {
    const rule = findRule("/llms.txt");
    expect(rule).toBeDefined();
    const contentType = rule!.headers.find((h) => h.key === "Content-Type")?.value;
    const cache = rule!.headers.find((h) => h.key === "Cache-Control")?.value;
    expect(contentType).toBe("text/plain; charset=utf-8");
    expect(cache).toBe("public, max-age=3600");
  });

  it("serves /llms-full.txt as text/plain with a one-hour cache", () => {
    const rule = findRule("/llms-full.txt");
    expect(rule).toBeDefined();
    const contentType = rule!.headers.find((h) => h.key === "Content-Type")?.value;
    const cache = rule!.headers.find((h) => h.key === "Cache-Control")?.value;
    expect(contentType).toBe("text/plain; charset=utf-8");
    expect(cache).toBe("public, max-age=3600");
  });
});
