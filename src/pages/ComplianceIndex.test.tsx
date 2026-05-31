import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Mock the generated registry so the test is deterministic regardless of
// current content. Two frameworks (DORA + NIS2), 3 sub-pages total — enough
// to exercise the byFramework grouping path.
vi.mock("@/content/posts.generated", () => ({
  POSTS: [],
  POSTS_BY_SLUG: {},
  getPost: () => undefined,
  listPosts: () => [],
  listCompliancePosts: () => [
    {
      title: "DORA pentest for banking",
      description: "DORA scoping for credit institutions.",
      date: "2026-05-17",
      author: "Fleuret",
      tags: [],
      locale: "en",
      slug: "banking",
      readingTimeMinutes: 7,
      path: "/compliance/dora/banking",
      hreflangPath: "/compliance/dora/banking",
      kind: "compliance",
      framework: "dora",
      industry: "banking",
    },
    {
      title: "DORA pentest for fintech",
      description: "DORA scoping for fintech.",
      date: "2026-05-15",
      author: "Fleuret",
      tags: [],
      locale: "en",
      slug: "fintech",
      readingTimeMinutes: 6,
      path: "/compliance/dora/fintech",
      hreflangPath: "/compliance/dora/fintech",
      kind: "compliance",
      framework: "dora",
      industry: "fintech",
    },
    {
      title: "NIS2 pentest for water",
      description: "NIS2 scoping for water utilities.",
      date: "2026-05-13",
      author: "Fleuret",
      tags: [],
      locale: "en",
      slug: "water",
      readingTimeMinutes: 7,
      path: "/compliance/nis2/water",
      hreflangPath: "/compliance/nis2/water",
      kind: "compliance",
      framework: "nis2",
      industry: "water",
    },
  ],
  getCompliancePost: () => undefined,
}));

import ComplianceIndex from "./ComplianceIndex";

function renderHub(route = "/compliance") {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <LanguageProvider>
          <ComplianceIndex />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("ComplianceIndex", () => {
  it("renders an anchor link to every sub-page in the prerendered HTML", () => {
    renderHub("/compliance");
    // Crawlable links — Google reads <a href>, not JSON-LD ItemList, for
    // PageRank flow. Each sub-page must show up as a real anchor.
    const banking = screen.getByRole("link", { name: /DORA pentest for banking/i });
    const fintech = screen.getByRole("link", { name: /DORA pentest for fintech/i });
    const water = screen.getByRole("link", { name: /NIS2 pentest for water/i });
    expect(banking).toHaveAttribute("href", "/compliance/dora/banking");
    expect(fintech).toHaveAttribute("href", "/compliance/dora/fintech");
    expect(water).toHaveAttribute("href", "/compliance/nis2/water");
  });

  it("groups sub-pages by framework with the framework displayName as section header", () => {
    renderHub("/compliance");
    // Two distinct framework groups (DORA + NIS2). Header text comes from
    // FRAMEWORKS[slug].displayName in src/content/compliance/frameworks.
    expect(screen.getByRole("heading", { name: /^DORA$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^NIS2$/i })).toBeInTheDocument();
  });

  it("flips data-compliance-index-rendered on <html> after mount (prerender marker)", () => {
    delete document.documentElement.dataset.complianceIndexRendered;
    renderHub("/compliance");
    expect(document.documentElement.dataset.complianceIndexRendered).toBe("true");
  });
});
