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
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    mdx({
      providerImportSource: "@mdx-js/react",
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
