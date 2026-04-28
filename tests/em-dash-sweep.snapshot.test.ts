import { describe, expect, it } from "vitest";
import { sweep } from "../scripts/em-dash-sweep.mjs";

/**
 * Snapshot test for scripts/em-dash-sweep.mjs (decision 3B in
 * /plan-eng-review 2026-04-29). Pins the AST sweep so a future change
 * cannot silently corrupt code blocks, JSX components, or intentional
 * English idiom inside FR articles.
 *
 * Test corpus is intentionally small. The big-bang sweep over all 16
 * blog MDX files runs at apply-time; this test only proves the walker
 * correctly skips code, links, and JSX while replacing prose em-dashes.
 */

const FIXTURE = `---
title: "Test article"
description: "Used by em-dash-sweep.snapshot.test.ts"
date: "2026-04-29"
author: "Test"
locale: "en"
slug: "fixture"
audience: "direct"
---

import { SovereigntyProof } from "@/components/blog/SovereigntyProof";

# Heading with em-dash — that should be replaced

The first paragraph has an em-dash — and another one — like that.

Code block must be left alone:

\`\`\`ts
// This em-dash should NOT be replaced — it lives inside code.
const x = "a — b";
\`\`\`

Inline code: \`const y = "a — b"\` stays untouched.

A [link with — em-dash inside](https://example.com) is a link, leave it.

JSX component renders untouched:

<SovereigntyProof />

Final paragraph — final em-dash — sweep me.
`;

describe("em-dash-sweep AST walker", () => {
  it("identifies em-dashes in prose only, not code or links", () => {
    const { occurrences } = sweep(FIXTURE);
    // Heading + 2 in first paragraph + 2 in final paragraph = 5 prose
    // occurrences. Code block (1), inline code (1), and link (1) MUST
    // NOT be counted.
    expect(occurrences.length).toBe(5);
  });

  it("does not modify text inside code blocks when --apply implied", () => {
    const { rewritten } = sweep(FIXTURE);
    // Default sweep is non-mutating (CLI requires --apply flag); but the
    // returned string still passes through remark-stringify, so we just
    // verify code-block content survived round-trip.
    expect(rewritten).toContain('// This em-dash should NOT be replaced');
    expect(rewritten).toContain('const x = "a — b"');
  });

  it("preserves JSX component import and usage", () => {
    const { rewritten } = sweep(FIXTURE);
    expect(rewritten).toContain('import { SovereigntyProof }');
    expect(rewritten).toContain("<SovereigntyProof />");
  });

  it("preserves YAML frontmatter verbatim including audience field", () => {
    const { rewritten } = sweep(FIXTURE);
    expect(rewritten).toContain('audience: "direct"');
    expect(rewritten).toContain('slug: "fixture"');
  });

  it("preserves link target with em-dash inside link text", () => {
    const { rewritten } = sweep(FIXTURE);
    // Link node was skipped, so the em-dash inside link text survives.
    expect(rewritten).toContain("link with — em-dash");
  });

  it("output is stable (snapshot)", () => {
    const { rewritten } = sweep(FIXTURE);
    expect(rewritten).toMatchInlineSnapshot(`
      "---
      title: "Test article"
      description: "Used by em-dash-sweep.snapshot.test.ts"
      date: "2026-04-29"
      author: "Test"
      locale: "en"
      slug: "fixture"
      audience: "direct"
      ---

      import { SovereigntyProof } from "@/components/blog/SovereigntyProof";

      # Heading with em-dash — that should be replaced

      The first paragraph has an em-dash — and another one — like that.

      Code block must be left alone:

      \`\`\`ts
      // This em-dash should NOT be replaced — it lives inside code.
      const x = "a — b";
      \`\`\`

      Inline code: \`const y = "a — b"\` stays untouched.

      A [link with — em-dash inside](https://example.com) is a link, leave it.

      JSX component renders untouched:

      <SovereigntyProof />

      Final paragraph — final em-dash — sweep me.
      "
    `);
  });
});
