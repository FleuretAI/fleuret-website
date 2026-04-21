import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import path from "node:path";

// Mirror vite.config.ts plugin set so tests see identical MDX output.
// remark-frontmatter strips YAML from the MDX AST (codegen reads it via
// gray-matter separately).
export default defineConfig({
  plugins: [
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [[remarkFrontmatter, ["yaml"]], remarkGfm],
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
