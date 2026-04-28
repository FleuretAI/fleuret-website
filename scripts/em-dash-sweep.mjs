#!/usr/bin/env node
/**
 * Em-dash sweep for MDX blog content.
 *
 * CLAUDE.md hard rule: never use the " — " em-dash separator pattern in
 * user-facing copy. Reads AI-generated. This script walks MDX text nodes
 * only (skipping code blocks, inline code, JSX elements, links, images,
 * frontmatter) and reports / replaces occurrences.
 *
 * Usage:
 *   node scripts/em-dash-sweep.mjs                           # report only
 *   node scripts/em-dash-sweep.mjs --apply                   # rewrite files in place
 *   node scripts/em-dash-sweep.mjs --apply --pattern '...'   # replace with custom string
 *   node scripts/em-dash-sweep.mjs --files path1,path2       # restrict to specific files
 *
 * Replacement rule (default): ` — ` -> `. ` (sentence break). Pass --comma
 * to replace with `, ` instead. Per-file polish recommended after --apply.
 *
 * Decision lineage: /plan-eng-review 3B (2026-04-29) — chose AST walker
 * over naive sed to avoid eating em-dashes inside code blocks, inline code,
 * and intentional English idiom citations inside FR articles.
 *
 * Pinned by tests/em-dash-sweep.snapshot.test.ts.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { visit, SKIP } from "unist-util-visit";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DEFAULT_DIRS = [
  join(ROOT, "src/content/blog/fr"),
  join(ROOT, "src/content/blog/en"),
];

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const COMMA = args.includes("--comma");
const FILES_ARG = args.find((a) => a.startsWith("--files="));
const PATTERN_ARG = args.find((a) => a.startsWith("--pattern="));

const REPLACEMENT = PATTERN_ARG
  ? PATTERN_ARG.slice("--pattern=".length)
  : COMMA
    ? ", "
    : ". ";

// Match em-dash with surrounding whitespace. Both ` — ` (true em) and ` -- `
// (typographer fallback) are treated as the rule violation.
const EM_DASH_RE = / — | -- /g;

/** Walk a directory, return all .mdx file paths. */
function findMdxFiles(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...findMdxFiles(full));
    } else if (entry.endsWith(".mdx")) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Sweep one MDX source string.
 *
 * Returns { rewritten, occurrences } where `occurrences` is an array of
 * { line, column, snippet } for each em-dash found in a sweepable text
 * node. Code, inlineCode, mdxJsxFlowElement, mdxJsxTextElement, link, and
 * image nodes are NEVER touched. Frontmatter is preserved verbatim.
 */
export function sweep(source) {
  const occurrences = [];

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml", "toml"])
    .use(remarkGfm)
    .use(remarkMdx)
    .use(() => (tree) => {
      visit(tree, (node) => {
        // Skip every node type that represents code, JSX, or links.
        if (
          node.type === "code" ||
          node.type === "inlineCode" ||
          node.type === "yaml" ||
          node.type === "toml" ||
          node.type === "mdxJsxFlowElement" ||
          node.type === "mdxJsxTextElement" ||
          node.type === "mdxFlowExpression" ||
          node.type === "mdxTextExpression" ||
          node.type === "mdxjsEsm" ||
          node.type === "html" ||
          node.type === "link" ||
          node.type === "image" ||
          node.type === "linkReference" ||
          node.type === "imageReference"
        ) {
          return SKIP;
        }

        if (node.type === "text" && typeof node.value === "string") {
          const matches = [...node.value.matchAll(EM_DASH_RE)];
          if (matches.length === 0) return;

          for (const m of matches) {
            const start = node.position?.start;
            occurrences.push({
              line: start?.line ?? -1,
              column: (start?.column ?? 0) + (m.index ?? 0),
              snippet: node.value
                .slice(Math.max(0, (m.index ?? 0) - 30), (m.index ?? 0) + 30 + m[0].length)
                .replace(/\n/g, " "),
            });
          }

          if (APPLY) {
            node.value = node.value.replace(EM_DASH_RE, REPLACEMENT);
          }
        }
      });
    })
    .use(remarkStringify, {
      bullet: "-",
      emphasis: "_",
      strong: "*",
      fences: true,
      listItemIndent: "one",
      rule: "-",
    });

  const file = processor.processSync(source);
  return { rewritten: String(file), occurrences };
}

function main() {
  const files = FILES_ARG
    ? FILES_ARG.slice("--files=".length).split(",").map((p) => resolve(p))
    : DEFAULT_DIRS.flatMap(findMdxFiles);

  if (files.length === 0) {
    console.error("No MDX files matched.");
    process.exit(0);
  }

  let totalOccurrences = 0;
  let touchedFiles = 0;

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    const { rewritten, occurrences } = sweep(source);
    if (occurrences.length === 0) continue;

    totalOccurrences += occurrences.length;
    touchedFiles++;

    const rel = relative(ROOT, file);
    console.log(`\n${rel} (${occurrences.length})`);
    for (const occ of occurrences) {
      console.log(`  ${occ.line}:${occ.column}  ...${occ.snippet}...`);
    }

    if (APPLY) {
      writeFileSync(file, rewritten, "utf8");
    }
  }

  console.log(
    `\n${APPLY ? "Rewrote" : "Found"} ${totalOccurrences} em-dash separator(s) across ${touchedFiles} file(s).`,
  );
  if (!APPLY && totalOccurrences > 0) {
    console.log("Re-run with --apply to rewrite. Default replacement: '. '. Use --comma for ', '.");
    process.exit(1);
  }
}

// Run main only when invoked as CLI, not when imported by the test.
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
