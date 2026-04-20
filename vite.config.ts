import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Plugin order matters: @mdx-js/rollup MUST run BEFORE @vitejs/plugin-react-swc
// so SWC receives JSX (not raw MDX). providerImportSource wires MDX output to
// pick up React automatically via @mdx-js/react's MDXProvider.
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    }),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
