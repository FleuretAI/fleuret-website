import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import path from "node:path";

// MDX plugin is loaded even for tests because some component tests exercise
// the blog post rendering path; BlogIndex tests mock the registry so they
// don't touch MDX, but keeping the plugin active avoids branching configs.
// If test runtime grows painful, drop the MDX plugin and mark MDX-touching
// tests as integration-only.
export default defineConfig({
  plugins: [
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    }),
    react(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: [
      "tests/**/*.test.{ts,tsx}",
      "src/**/*.test.{ts,tsx}",
      "scripts/**/*.test.{ts,mjs}",
    ],
  },
});
