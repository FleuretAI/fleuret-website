import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";

// BlogIndex reads from the generated registry. Stub it so the test is
// deterministic regardless of current content.
vi.mock("@/content/posts.generated", () => ({
  POSTS: [],
  POSTS_BY_SLUG: {},
  getPost: () => undefined,
  listPosts: (locale: string) => {
    if (locale !== "fr") return [];
    return [
      {
        title: "Post A",
        description: "desc A",
        date: "2026-04-20",
        author: "yanis",
        tags: [],
        locale: "fr",
        slug: "post-a",
        readingTimeMinutes: 5,
        path: "/blog/post-a",
        hreflangPath: "/en/blog/post-a",
      },
      {
        title: "Post B",
        description: "desc B",
        date: "2026-04-10",
        author: "yanis",
        tags: [],
        locale: "fr",
        slug: "post-b",
        readingTimeMinutes: 3,
        path: "/blog/post-b",
        hreflangPath: "/en/blog/post-b",
      },
    ];
  },
}));

import BlogIndex from "./BlogIndex";

function renderIndex(route = "/blog") {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <LanguageProvider>
          <BlogIndex />
        </LanguageProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );
}

describe("BlogIndex", () => {
  beforeEach(() => {
    // Pin FR to defeat LanguageProvider's initial EN-redirect behavior.
    window.localStorage.setItem("fleuret_lang", "fr");
  });

  it("renders all posts for current locale in date-desc order", () => {
    renderIndex("/blog");
    const a = screen.getByText("Post A");
    const b = screen.getByText("Post B");
    // Post A is newer, should come first in DOM order.
    expect(a.compareDocumentPosition(b)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("shows empty state when no posts for locale", () => {
    // Switch to EN route where the mock returns no posts.
    window.localStorage.setItem("fleuret_lang", "en");
    renderIndex("/en/blog");
    expect(screen.getByText(/No posts yet|Pas encore/i)).toBeInTheDocument();
  });
});
