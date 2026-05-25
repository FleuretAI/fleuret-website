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

describe("PricingSection — POC card", () => {
  it("renders POC card", () => {
    renderSection();
    expect(screen.getByTestId("pricing-card-poc")).toBeInTheDocument();
  });

  it("POC card includes the upgrade-credit pill", () => {
    renderSection();
    const pill = screen.getByTestId("pricing-poc-upgrade-credit");
    expect(pill).toBeInTheDocument();
    expect(pill.textContent?.trim().length).toBeGreaterThan(10);
  });

  it("guarantee block renders inside POC card", () => {
    renderSection();
    const pocCard = screen.getByTestId("pricing-card-poc");
    const titleRegex = /(0 finding|0 findings)/i;
    expect(within(pocCard).getByText(titleRegex)).toBeInTheDocument();
  });
});

describe("PricingSection — continuous tiers", () => {
  it("renders all 3 tier cards (Starter, Growth, Scale)", () => {
    renderSection();
    expect(screen.getByTestId("pricing-tier-starter")).toBeInTheDocument();
    expect(screen.getByTestId("pricing-tier-growth")).toBeInTheDocument();
    expect(screen.getByTestId("pricing-tier-scale")).toBeInTheDocument();
  });

  it("renders the pricing layout grid", () => {
    renderSection();
    expect(screen.getByTestId("pricing-layout")).toBeInTheDocument();
  });

  it("Starter shows €10,000 price", () => {
    renderSection();
    const starter = screen.getByTestId("pricing-tier-starter");
    expect(starter.textContent).toMatch(/10[,.]?000/);
  });

  it("Growth shows €25,000 price", () => {
    renderSection();
    const growth = screen.getByTestId("pricing-tier-growth");
    expect(growth.textContent).toMatch(/25[,.]?000/);
  });

  it("Scale shows custom pricing", () => {
    renderSection();
    const scale = screen.getByTestId("pricing-tier-scale");
    expect(scale.textContent).toMatch(/custom|sur mesure/i);
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
