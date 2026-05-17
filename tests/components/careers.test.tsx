import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Careers from "@/pages/Careers";

/**
 * Invariant tests for the /careers v1 rewrite (per /plan-eng-review Finding 3.1A
 * 2026-05-17). Page targets warm post-Achille candidates (Charef-tier). Each
 * assertion below maps to a load-bearing piece of the technical-thesis spike
 * (98/2 + Émile + open-weight) that answered Charef's verbatim concern
 * "where's the long-term vision".
 *
 * If any of these regress, the page loses its conversion lever for the
 * Charef-tier visitor. The "no open positions" empty-state regression is the
 * single highest-risk failure mode (it shipped that wording for months before
 * this rewrite).
 */

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/careers"]}>
        <LanguageProvider>
          <Careers />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("/careers v1 invariants", () => {
  it("renders the page without throwing", () => {
    renderPage();
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings.length).toBeGreaterThan(0);
  });

  it("mentions Émile in the hero or Émile section", () => {
    renderPage();
    expect(screen.getAllByText(/Émile/).length).toBeGreaterThan(0);
  });

  it("uses the 98/2 framing on the page", () => {
    renderPage();
    expect(screen.getAllByText(/98%/).length).toBeGreaterThan(0);
  });

  it("uses the word 'orchestration' as the load-bearing technical thesis", () => {
    renderPage();
    expect(screen.getAllByText(/orchestration/i).length).toBeGreaterThan(0);
  });

  it("lists all three open roles by their canonical titles", () => {
    renderPage();
    expect(screen.getAllByText(/AI Engineer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Senior Offensive Security Engineer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Founding Engineer/i).length).toBeGreaterThan(0);
  });

  it("primary CTA links to mailto:yanis@fleuret.ai", () => {
    renderPage();
    const links = screen.getAllByRole("link");
    const mailto = links.find((a) =>
      a.getAttribute("href")?.startsWith("mailto:yanis@fleuret.ai"),
    );
    expect(mailto).toBeDefined();
  });

  it("does NOT show the 'no open positions' empty state (regression watch)", () => {
    renderPage();
    expect(screen.queryByText(/no open positions/i)).toBeNull();
    expect(screen.queryByText(/spontaneous application/i)).toBeNull();
  });

  it("shows yanis@fleuret.ai as visible plain text (mailto silent-fail fallback)", () => {
    renderPage();
    const matches = screen.getAllByText(/yanis@fleuret\.ai/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it("does NOT introduce the em-dash separator pattern '— ' in rendered prose", () => {
    const { container } = renderPage();
    // U+2014 followed by a space, the AI-slop pattern banned by CLAUDE.md.
    expect(container.textContent || "").not.toMatch(/— /);
  });
});
