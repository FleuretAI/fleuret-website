// Regression: ISSUE-001 — breadcrumb "Compliance" segment rendered as plain
// text instead of a Link, even after the /compliance hub page shipped.
// Found by /qa on 2026-05-17.
// Report: .gstack/qa-reports/qa-report-fleuret-ai-2026-05-17.md

import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";

// CompliancePage looks up the entry via getCompliancePost and then lazy-loads
// the MDX. Stub both so the test is deterministic and renders synchronously.
vi.mock("@/content/posts.generated", () => {
  const entry = {
    meta: {
      title: "DORA pentest for fintech",
      description: "stub",
      date: "2026-05-16",
      author: "Fleuret",
      tags: [],
      locale: "en" as const,
      slug: "fintech",
      readingTimeMinutes: 5,
      path: "/compliance/dora/fintech",
      hreflangPath: "/compliance/dora/fintech",
      kind: "compliance" as const,
      framework: "dora",
      industry: "fintech",
    },
    load: () => Promise.resolve({ default: () => <p>stub mdx body</p> }),
  };
  return {
    POSTS: [entry.meta],
    POSTS_BY_SLUG: { "compliance:dora:fintech": entry },
    getPost: () => undefined,
    getCompliancePost: (f: string, i: string) =>
      f === "dora" && i === "fintech" ? entry : undefined,
    listPosts: () => [],
    listCompliancePosts: () => [entry.meta],
  };
});

import CompliancePage from "./CompliancePage";

function renderPage(route = "/compliance/dora/fintech") {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <LanguageProvider>
          <Routes>
            <Route
              path="/compliance/:framework/:industry"
              element={<CompliancePage />}
            />
          </Routes>
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("CompliancePage breadcrumb (ISSUE-001 regression)", () => {
  it("renders a Compliance link pointing at /compliance, not plain text", async () => {
    renderPage();
    // Multiple "Compliance" links exist (breadcrumb + footer). Verify at least
    // one points to /compliance.
    const links = await screen.findAllByRole("link", { name: "Compliance" });
    const complianceLink = links.find((l) => l.getAttribute("href") === "/compliance");
    expect(complianceLink).toBeDefined();
  });

  it("keeps Home as a separate link, not collapsed with Compliance", async () => {
    renderPage();
    const home = await screen.findByRole("link", { name: "Home" });
    const complianceLinks = await screen.findAllByRole("link", { name: "Compliance" });
    const complianceLink = complianceLinks.find((l) => l.getAttribute("href") === "/compliance");
    expect(complianceLink).toBeDefined();
    expect(home).not.toBe(complianceLink);
    expect(home.getAttribute("href")).toBe("/");
  });

  it("keeps framework segment (DORA) as plain text since /compliance/dora landing does not exist yet", async () => {
    renderPage();
    // DORA appears in heading + breadcrumb + body. The breadcrumb instance
    // must NOT be a link. Walk every element with text "DORA" and assert at
    // least one is an <li> (the breadcrumb li), not an <a>.
    const matches = await screen.findAllByText(/^DORA$/);
    const hasBreadcrumbLi = matches.some(
      (el) => el.tagName === "LI" && el.getAttribute("aria-current") !== "page",
    );
    expect(hasBreadcrumbLi).toBe(true);
  });
});
