import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { buildCorsHeaders, handlePreflight } from "./cors.ts";

Deno.test("buildCorsHeaders: allowed origin gets echoed in ACAO", () => {
  const req = new Request("http://localhost", { headers: { origin: "https://fleuret-ai.com" } });
  const headers = buildCorsHeaders(req);
  assertEquals(headers["Access-Control-Allow-Origin"], "https://fleuret-ai.com");
  assertEquals(headers["Vary"], "Origin");
});

Deno.test("buildCorsHeaders: disallowed origin gets NO ACAO header", () => {
  const req = new Request("http://localhost", { headers: { origin: "https://evil.example" } });
  const headers = buildCorsHeaders(req);
  assertEquals(headers["Access-Control-Allow-Origin"], undefined);
});

Deno.test("buildCorsHeaders: missing origin gets NO ACAO header", () => {
  const req = new Request("http://localhost");
  const headers = buildCorsHeaders(req);
  assertEquals(headers["Access-Control-Allow-Origin"], undefined);
});

Deno.test("handlePreflight: returns 204-ish response on OPTIONS", () => {
  const req = new Request("http://localhost", {
    method: "OPTIONS",
    headers: { origin: "https://fleuret-ai.com" },
  });
  const res = handlePreflight(req);
  if (!res) throw new Error("expected a response");
  assertEquals(res.status, 200);
  assertEquals(res.headers.get("Access-Control-Allow-Origin"), "https://fleuret-ai.com");
});

Deno.test("handlePreflight: returns null for non-OPTIONS", () => {
  const req = new Request("http://localhost", { method: "POST" });
  assertEquals(handlePreflight(req), null);
});
