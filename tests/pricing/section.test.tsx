import { describe, expect, it } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
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

describe("PricingSection — renders both SKUs", () => {
  it("renders POC card", () => {
    renderSection();
    expect(screen.getByTestId("pricing-card-poc")).toBeInTheDocument();
  });

  it("renders Recurring card", () => {
    renderSection();
    expect(screen.getByTestId("pricing-card-recurring")).toBeInTheDocument();
  });

  it("Recurring has the gradient glow (highlighted SKU)", () => {
    renderSection();
    expect(screen.getByTestId("pricing-recurring-glow")).toBeInTheDocument();
  });

  it("POC does NOT render the gradient glow", () => {
    renderSection();
    const pocCard = screen.getByTestId("pricing-card-poc");
    expect(within(pocCard).queryByTestId("pricing-recurring-glow")).toBeNull();
  });

  it("POC card includes the upgrade-credit pill", () => {
    renderSection();
    const pill = screen.getByTestId("pricing-poc-upgrade-credit");
    expect(pill).toBeInTheDocument();
    // Pill copy resolves from i18n; assert it is a non-empty string.
    expect(pill.textContent?.trim().length).toBeGreaterThan(10);
  });
});

describe("PricingSection — 1yr / 3yr toggle", () => {
  it("defaults to 1yr (€30,000)", () => {
    renderSection();
    const price = screen.getByTestId("pricing-recurring-price");
    expect(price.textContent).toMatch(/30/);
  });

  it("switches to 3yr (€27,000) on click", () => {
    renderSection();
    fireEvent.click(screen.getByTestId("pricing-recurring-toggle-3yr"));
    const price = screen.getByTestId("pricing-recurring-price");
    expect(price.textContent).toMatch(/27/);
    expect(screen.getByTestId("pricing-recurring-savings")).toBeInTheDocument();
  });

  it("toggles back to 1yr", () => {
    renderSection();
    fireEvent.click(screen.getByTestId("pricing-recurring-toggle-3yr"));
    fireEvent.click(screen.getByTestId("pricing-recurring-toggle-1yr"));
    const price = screen.getByTestId("pricing-recurring-price");
    expect(price.textContent).toMatch(/30/);
    expect(screen.queryByTestId("pricing-recurring-savings")).toBeNull();
  });

  it("toggle buttons have role=radio with aria-checked reflecting state", () => {
    renderSection();
    const oneYr = screen.getByTestId("pricing-recurring-toggle-1yr");
    const threeYr = screen.getByTestId("pricing-recurring-toggle-3yr");
    expect(oneYr.getAttribute("aria-checked")).toBe("true");
    expect(threeYr.getAttribute("aria-checked")).toBe("false");
    fireEvent.click(threeYr);
    expect(oneYr.getAttribute("aria-checked")).toBe("false");
    expect(threeYr.getAttribute("aria-checked")).toBe("true");
  });
});

describe("PricingSection — mobile order swap", () => {
  it("Recurring slot has lower CSS order (rendered first on mobile)", () => {
    renderSection();
    const recurringSlot = screen.getByTestId("pricing-card-slot-recurring");
    const pocSlot = screen.getByTestId("pricing-card-slot-poc");
    const recOrder = parseInt((recurringSlot as HTMLElement).style.order || "0", 10);
    const pocOrder = parseInt((pocSlot as HTMLElement).style.order || "0", 10);
    // Recurring renders first (lower order value) on mobile.
    expect(recOrder).toBeLessThan(pocOrder);
  });
});

describe("PricingSection — guarantee scope", () => {
  it("guarantee block renders inside POC card only", () => {
    renderSection();
    const pocCard = screen.getByTestId("pricing-card-poc");
    const recurringCard = screen.getByTestId("pricing-card-recurring");
    // Guarantee title text from i18n. Match either FR or EN form.
    const titleRegex = /(0 finding|0 findings)/i;
    expect(within(pocCard).getByText(titleRegex)).toBeInTheDocument();
    expect(within(recurringCard).queryByText(titleRegex)).toBeNull();
  });
});

describe("PricingSection — banners", () => {
  it("renders DP cohort cross-link banner (DP_COHORT_VISIBLE defaults to true)", () => {
    renderSection();
    expect(screen.getByTestId("pricing-dp-banner")).toBeInTheDocument();
  });

  it("renders Partners cross-link banner unconditionally", () => {
    renderSection();
    expect(screen.getByTestId("pricing-partners-banner")).toBeInTheDocument();
  });

  it("DP banner links to /design-partners (FR locale by default)", () => {
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
