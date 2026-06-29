import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Demo from "@/pages/Demo";

/**
 * Invariant tests for the /demo scheduler-engagement instrumentation
 * (GA4 loop Flag A, 2026-06-29).
 *
 * Context: the booking widget is a cross-origin Google appointment iframe. It
 * emits no postMessage and supports no confirmation redirect, so a confirmed
 * booking cannot be observed from the parent window. The loop had been mapping
 * the funnel's terminal "booked" step onto demo_scheduler_fallback_clicked,
 * which only fires when the iframe is blocked — so it measured nothing real.
 *
 * The fix fires demo_scheduler_engaged once when the visitor clicks into the
 * iframe (parent window blurs while document.activeElement is the iframe). These
 * tests pin that behaviour: it fires once on engagement, never on an unrelated
 * blur, and the booking-intent paths (iframe + fallback link) still render.
 */

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/demo"]}>
        <LanguageProvider>
          <Demo />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

let gtag: ReturnType<typeof vi.fn>;

beforeEach(() => {
  gtag = vi.fn();
  (window as unknown as { gtag: typeof gtag }).gtag = gtag;
});

afterEach(() => {
  delete (window as unknown as { gtag?: unknown }).gtag;
  vi.restoreAllMocks();
});

function eventsNamed(name: string) {
  return gtag.mock.calls.filter((c) => c[0] === "event" && c[1] === name);
}

describe("/demo scheduler engagement (Flag A)", () => {
  it("fires demo_scheduler_engaged once when the visitor focuses the iframe", () => {
    const { container } = renderPage();
    const iframe = container.querySelector("iframe");
    expect(iframe).not.toBeNull();

    // Simulate focus moving into the cross-origin iframe: activeElement becomes
    // the iframe, then the parent window receives a blur event.
    Object.defineProperty(document, "activeElement", {
      configurable: true,
      get: () => iframe,
    });
    window.dispatchEvent(new Event("blur"));
    window.dispatchEvent(new Event("blur")); // second blur must not double-count

    expect(eventsNamed("demo_scheduler_engaged")).toHaveLength(1);
  });

  it("does not fire demo_scheduler_engaged on a blur unrelated to the iframe", () => {
    renderPage();
    Object.defineProperty(document, "activeElement", {
      configurable: true,
      get: () => document.body,
    });
    window.dispatchEvent(new Event("blur"));
    expect(eventsNamed("demo_scheduler_engaged")).toHaveLength(0);
  });

  it("still renders both booking-intent paths: the scheduler iframe and the fallback link", () => {
    const { container } = renderPage();
    expect(container.querySelector("iframe")).not.toBeNull();
    // Fallback link points at the short calendar.app.google URL.
    const fallback = Array.from(container.querySelectorAll("a")).find((a) =>
      a.getAttribute("href")?.includes("calendar.app.google"),
    );
    expect(fallback).toBeTruthy();
  });

  it("fires demo_page_view on mount (funnel entry, unchanged)", () => {
    renderPage();
    expect(eventsNamed("demo_page_view").length).toBeGreaterThanOrEqual(1);
  });
});
