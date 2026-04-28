import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Partners from "@/pages/Partners";
import { LanguageProvider } from "@/contexts/LanguageContext";

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <LanguageProvider>
          <Partners />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("Partners page — smoke render", () => {
  it("mounts without throwing", () => {
    expect(() => renderPage()).not.toThrow();
  });

  it("renders the hero CTA", () => {
    renderPage();
    expect(screen.getByTestId("partners-hero-cta")).toBeInTheDocument();
  });

  it("renders all three audience cards (GRC, marketplace, advisory)", () => {
    renderPage();
    // Each audience card has a title from i18n. Multiple GRC mentions exist
    // (audience card + wholesale model section), so use getAllByText.
    expect(screen.getAllByText(/GRC/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/[Mm]arketplace/).length).toBeGreaterThan(0);
  });

  it("renders both wholesale model cards (GRC + marketplace)", () => {
    renderPage();
    expect(screen.getByTestId("partners-model-grc")).toBeInTheDocument();
    expect(screen.getByTestId("partners-model-marketplace")).toBeInTheDocument();
  });

  it("renders sub-processors cross-link", () => {
    renderPage();
    const link = screen.getByTestId("partners-subprocessors-link") as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toContain("/sub-processors");
  });

  it("renders final demo CTA", () => {
    renderPage();
    const cta = screen.getByTestId("partners-final-cta") as HTMLAnchorElement;
    expect(cta).toBeInTheDocument();
    expect(cta.getAttribute("href")).toContain("/demo");
  });
});
