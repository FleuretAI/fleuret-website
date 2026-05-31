import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Default 4-post mock so the slice(0, 3) cap is exercised. Switched per-test
// via vi.mocked when we need to test the empty-state path.
let mockPosts: Array<Record<string, unknown>> = [
  {
    title: "Post Alpha",
    description: "alpha desc",
    date: "2026-05-20",
    author: "yanis",
    tags: [],
    locale: "en",
    slug: "alpha",
    readingTimeMinutes: 5,
    path: "/blog/alpha",
    hreflangPath: "/blog/alpha",
    kind: "blog",
  },
  {
    title: "Post Beta",
    description: "beta desc",
    date: "2026-05-15",
    author: "yanis",
    tags: [],
    locale: "en",
    slug: "beta",
    readingTimeMinutes: 5,
    path: "/blog/beta",
    hreflangPath: "/blog/beta",
    kind: "blog",
  },
  {
    title: "Post Gamma",
    description: "gamma desc",
    date: "2026-05-10",
    author: "yanis",
    tags: [],
    locale: "en",
    slug: "gamma",
    readingTimeMinutes: 5,
    path: "/blog/gamma",
    hreflangPath: "/blog/gamma",
    kind: "blog",
  },
  {
    title: "Post Delta",
    description: "delta desc",
    date: "2026-05-05",
    author: "yanis",
    tags: [],
    locale: "en",
    slug: "delta",
    readingTimeMinutes: 5,
    path: "/blog/delta",
    hreflangPath: "/blog/delta",
    kind: "blog",
  },
];

vi.mock("@/content/posts.generated", () => ({
  POSTS: [],
  POSTS_BY_SLUG: {},
  getPost: () => undefined,
  listPosts: () => mockPosts,
  listCompliancePosts: () => [],
}));

import LatestBlog from "./LatestBlog";

function renderLatest() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <LanguageProvider>
        <LatestBlog />
      </LanguageProvider>
    </MemoryRouter>,
  );
}

describe("LatestBlog", () => {
  it("renders exactly the 3 most recent posts (slice cap, not all available)", () => {
    renderLatest();
    expect(screen.getByText("Post Alpha")).toBeInTheDocument();
    expect(screen.getByText("Post Beta")).toBeInTheDocument();
    expect(screen.getByText("Post Gamma")).toBeInTheDocument();
    // 4th post must be filtered out by the slice(0, 3) on listPosts().
    expect(screen.queryByText("Post Delta")).not.toBeInTheDocument();
  });

  it("each post tile is a clickable link to /blog/{slug}", () => {
    renderLatest();
    expect(
      screen.getByRole("link", { name: /Post Alpha/i }),
    ).toHaveAttribute("href", "/blog/alpha");
    expect(
      screen.getByRole("link", { name: /Post Beta/i }),
    ).toHaveAttribute("href", "/blog/beta");
    expect(
      screen.getByRole("link", { name: /Post Gamma/i }),
    ).toHaveAttribute("href", "/blog/gamma");
  });

  it("renders a 'view all' link pointing at the blog hub", () => {
    renderLatest();
    // Anchor to the /blog hub strengthens link equity flow from homepage to
    // BlogIndex, separate from the per-post tiles above.
    const links = screen
      .getAllByRole("link")
      .filter((el) => el.getAttribute("href") === "/blog");
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it("returns null when no posts are available (graceful empty-state)", () => {
    const originalPosts = mockPosts;
    mockPosts = [];
    const { container } = renderLatest();
    // Empty state must produce zero DOM output so the homepage layout
    // doesn't render a hollow section header with no content.
    expect(container.firstChild).toBeNull();
    mockPosts = originalPosts;
  });
});
