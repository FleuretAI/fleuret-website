import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { escapeHtml } from "./escape-html.ts";

Deno.test("escapeHtml: handles null and undefined", () => {
  assertEquals(escapeHtml(null), "");
  assertEquals(escapeHtml(undefined), "");
});

Deno.test("escapeHtml: passes plain text unchanged", () => {
  assertEquals(escapeHtml("Jane Doe"), "Jane Doe");
  assertEquals(escapeHtml("alice@example.com"), "alice@example.com");
});

Deno.test("escapeHtml: escapes the five dangerous characters", () => {
  assertEquals(escapeHtml("&"), "&amp;");
  assertEquals(escapeHtml("<"), "&lt;");
  assertEquals(escapeHtml(">"), "&gt;");
  assertEquals(escapeHtml('"'), "&quot;");
  assertEquals(escapeHtml("'"), "&#39;");
});

Deno.test("escapeHtml: neutralizes a <script> XSS payload", () => {
  const payload = "<script>alert('xss')</script>";
  const escaped = escapeHtml(payload);
  assertEquals(escaped, "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
  // Ensure no raw <script> substring survives
  if (escaped.includes("<script")) throw new Error("XSS payload survived escaping");
});

Deno.test("escapeHtml: neutralizes an <img onerror> payload", () => {
  const payload = `<img src=x onerror="alert(1)">`;
  const escaped = escapeHtml(payload);
  if (escaped.includes("<img")) throw new Error("img tag survived escaping");
  if (escaped.includes("onerror=")) {
    // onerror= as a literal substring is fine — the = is not escaped.
    // But the surrounding < and " must be.
    if (escaped.includes("<")) throw new Error("< survived");
    if (/onerror="/i.test(escaped)) throw new Error("unescaped quote after onerror");
  }
});

Deno.test("escapeHtml: handles numeric and boolean inputs via String()", () => {
  assertEquals(escapeHtml(42), "42");
  assertEquals(escapeHtml(true), "true");
});
