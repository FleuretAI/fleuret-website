import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PricingSection from "@/components/PricingSection";
import { LanguageProvider } from "@/contexts/LanguageContext";

function renderSection() {
  return render(
    <MemoryRouter>
      <LanguageProvider>
        <PricingSection />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

describe("PricingSection — 3-card product-led layout", () => {
  it("renders the pricing layout grid", () => {
    renderSection();
    expect(screen.getByTestId("pricing-layout")).toBeInTheDocument();
  });

  it("renders all 3 cards (Pentest, Advanced, Continuous)", () => {
    renderSection();
    expect(screen.getByTestId("pricing-tier-pentest")).toBeInTheDocument();
    expect(screen.getByTestId("pricing-tier-advanced")).toBeInTheDocument();
    expect(screen.getByTestId("pricing-tier-continuous")).toBeInTheDocument();
  });

  it("does NOT render the old category labels or separate POC card", () => {
    renderSection();
    expect(screen.queryByTestId("pricing-label-poc")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pricing-label-continuous")).not.toBeInTheDocument();
    expect(screen.queryByTestId("pricing-card-poc")).not.toBeInTheDocument();
  });

  it("Pentest shows €4,000 per-test price", () => {
    renderSection();
    const pentest = screen.getByTestId("pricing-tier-pentest");
    expect(pentest.textContent).toMatch(/4[,. ]?000/);
  });

  it("Advanced shows €8,000 per-test price", () => {
    renderSection();
    const advanced = screen.getByTestId("pricing-tier-advanced");
    expect(advanced.textContent).toMatch(/8[,. ]?000/);
  });

  it("Continuous shows custom / quote pricing", () => {
    renderSection();
    const continuous = screen.getByTestId("pricing-tier-continuous");
    expect(continuous.textContent).toMatch(/custom|sur devis/i);
  });
});

describe("PricingSection — guarantee + anchor", () => {
  it("guarantee badge renders below the grid", () => {
    renderSection();
    const guarantee = screen.getByTestId("pricing-guarantee");
    expect(guarantee).toBeInTheDocument();
    const titleRegex = /(0 finding|0 findings)/i;
    expect(within(guarantee).getByText(titleRegex)).toBeInTheDocument();
  });
});

describe("PricingSection — banners", () => {
  it("renders DP cohort cross-link banner", () => {
    renderSection();
    expect(screen.getByTestId("pricing-dp-banner")).toBeInTheDocument();
  });

  it("renders Partners cross-link banner", () => {
    renderSection();
    expect(screen.getByTestId("pricing-partners-banner")).toBeInTheDocument();
  });

  it("DP banner links to /design-partners", () => {
    renderSection();
    const banner = screen.getByTestId("pricing-dp-banner") as HTMLAnchorElement;
    expect(banner.getAttribute("href")).toContain("/design-partners");
  });

  it("Partners banner links to /partners", () => {
    renderSection();
    const banner = screen.getByTestId("pricing-partners-banner") as HTMLAnchorElement;
    expect(banner.getAttribute("href")).toContain("/partners");
  });
});
