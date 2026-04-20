import { describe, expect, it, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SEO } from "./SEO";
import { LanguageProvider } from "@/contexts/LanguageContext";

function renderWithProviders(node: React.ReactNode, route = "/") {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <LanguageProvider>{node}</LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

/**
 * Regression tests for SEO.tsx. Prior to the blog PR, SEO had no tests and
 * only a `pageKey` path. This PR adds an optional `meta` override. These
 * tests guard both paths and the precedence rule (meta wins).
 *
 * react-helmet-async writes to the DOM asynchronously. We poll with waitFor
 * rather than a fixed microtask wait (flaky on some CI runners).
 */

beforeEach(() => {
  // Force FR to avoid LanguageProvider's initial EN redirect interfering.
  window.localStorage.setItem("fleuret_lang", "fr");
});

describe("SEO (static pageKey path — REGRESSION GATE)", () => {
  it("renders title from META[pageKey][language]", async () => {
    renderWithProviders(<SEO pageKey="home" />, "/");
    await waitFor(() => {
      expect(document.title).toContain("Fleuret");
    });
  });

  it("renders keywords when defined for pageKey", async () => {
    renderWithProviders(<SEO pageKey="home" />, "/");
    await waitFor(() => {
      expect(document.querySelector('meta[name="keywords"]')).not.toBeNull();
    });
  });
});

describe("SEO (dynamic meta override path)", () => {
  it("uses override title + canonical, bypassing META[pageKey]", async () => {
    renderWithProviders(
      <SEO
        meta={{
          title: "Custom Post Title | Fleuret",
          description: "Custom description.",
          canonical: "https://fleuret.ai/blog/foo",
          hreflangs: [
            { hrefLang: "fr", href: "https://fleuret.ai/blog/foo" },
            { hrefLang: "en", href: "https://fleuret.ai/en/blog/foo" },
          ],
        }}
      />,
      "/blog/foo",
    );
    await waitFor(() => {
      expect(document.title).toBe("Custom Post Title | Fleuret");
    });
    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe("https://fleuret.ai/blog/foo");
  });

  it("does NOT emit keywords when meta override present", async () => {
    renderWithProviders(
      <SEO
        meta={{
          title: "Post",
          description: "D",
          canonical: "https://fleuret.ai/blog/x",
          hreflangs: [],
        }}
      />,
      "/blog/x",
    );
    await waitFor(() => {
      expect(document.title).toBe("Post");
    });
    expect(document.querySelector('meta[name="keywords"]')).toBeNull();
  });

  it("throws when neither pageKey nor meta is provided", () => {
    expect(() =>
      // @ts-expect-error runtime guard
      renderWithProviders(<SEO />, "/"),
    ).toThrow();
  });
});
