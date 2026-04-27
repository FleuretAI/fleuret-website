import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeSlug from "rehype-slug";
import path from "path";

// Plugin order matters: @mdx-js/rollup MUST run BEFORE @vitejs/plugin-react-swc
// so SWC receives JSX (not raw MDX). providerImportSource wires MDX output to
// pick up React automatically via @mdx-js/react's MDXProvider.
//
// remark-frontmatter strips the YAML front block out of the MDX AST so it
// never renders as body text. Codegen (`scripts/build-post-registry.ts`)
// reads frontmatter via gray-matter separately; the MDX module only needs
// the body.
//
// `mdExtensions: []` removes the default `.md`/`.markdown` from MDX's match
// list so plain Markdown files are NOT processed as MDX. Without this, the
// plugin intercepts CHANGELOG.md before Vite's `?raw` query handler can
// return its source as a string. All blog posts use `.mdx`, which `mdx()`
// still matches via its default `mdxExtensions: ['.mdx']` — so this change
// has no impact on existing routes; it just frees `.md` (CHANGELOG.md and
// any future plain-markdown doc) for raw imports.
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    mdx({
      providerImportSource: "@mdx-js/react",
      mdExtensions: [],
      remarkPlugins: [[remarkFrontmatter, ["yaml"]], remarkGfm],
      rehypePlugins: [rehypeSlug],
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
