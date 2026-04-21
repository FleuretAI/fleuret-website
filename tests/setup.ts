import "@testing-library/jest-dom/vitest";

// jsdom lacks IntersectionObserver; framer-motion's `whileInView` needs it.
if (typeof globalThis.IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = "";
    thresholds = [];
  }
  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
