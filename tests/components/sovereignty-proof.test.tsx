import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SovereigntyProof } from "@/components/blog/SovereigntyProof";

/**
 * IRON RULE regression test (decision 3A in /plan-eng-review 2026-04-29).
 *
 * SovereigntyProof renders the sub-processor citation in 8 regulatory
 * articles (DORA, NIS2, PASSI, RGPD cluster). If the component breaks
 * during Vite prerender (scripts/prerender.mjs), LLM crawlers see no
 * anchor, sovereign claim becomes un-verifiable, GEO program loses its
 * strongest citation hook silently.
 *
 * Vitest does NOT exercise the full Puppeteer prerender. That gap is
 * covered by scripts/smoke.mjs at the build smoke layer. This test
 * catches component-level + import-resolution + accessibility issues
 * at PR time, before merge.
 */

function renderWithProviders(node: React.ReactNode, lang: "fr" | "en" = "fr") {
  window.localStorage.setItem("fleuret_lang", lang);
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <LanguageProvider>{node}</LanguageProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("SovereigntyProof (regulatory cluster citation hook)", () => {
  it("renders an anchor with href='/sub-processors'", () => {
    renderWithProviders(<SovereigntyProof />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/sub-processors");
  });

  it("renders FR copy when language is fr", () => {
    renderWithProviders(<SovereigntyProof />, "fr");
    expect(screen.getByText(/V[ée]rification souveraine/i)).toBeInTheDocument();
    // 'sous-traitants' appears in both body and link CTA. Either match counts.
    expect(screen.getAllByText(/sous-traitants/i).length).toBeGreaterThan(0);
  });

  it("renders EN copy when language is en", () => {
    renderWithProviders(<SovereigntyProof />, "en");
    expect(screen.getByText(/Sovereign verification/i)).toBeInTheDocument();
    expect(screen.getAllByText(/sub-processors/i).length).toBeGreaterThan(0);
  });

  it("aside is labeled for accessibility", () => {
    renderWithProviders(<SovereigntyProof />);
    const aside = screen.getByRole("complementary");
    expect(aside).toBeInTheDocument();
    expect(aside.getAttribute("aria-label")).toBeTruthy();
  });

  it("contains no em-dash separator (CLAUDE.md rule)", () => {
    const { container } = renderWithProviders(<SovereigntyProof />, "fr");
    expect(container.textContent).not.toContain(" — ");
  });
});
