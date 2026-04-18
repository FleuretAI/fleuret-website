import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { checkRateLimit, getClientIp } from "./rate-limit.ts";

Deno.test("getClientIp: prefers x-forwarded-for first value", () => {
  const req = new Request("http://localhost", {
    headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
  });
  assertEquals(getClientIp(req), "1.2.3.4");
});

Deno.test("getClientIp: falls back to cf-connecting-ip then x-real-ip then 'unknown'", () => {
  const cfReq = new Request("http://localhost", { headers: { "cf-connecting-ip": "9.9.9.9" } });
  assertEquals(getClientIp(cfReq), "9.9.9.9");

  const realReq = new Request("http://localhost", { headers: { "x-real-ip": "8.8.8.8" } });
  assertEquals(getClientIp(realReq), "8.8.8.8");

  const noReq = new Request("http://localhost");
  assertEquals(getClientIp(noReq), "unknown");
});

Deno.test("checkRateLimit: allows up to the threshold, blocks after", () => {
  const ip = `test-ip-${crypto.randomUUID()}`;
  for (let i = 0; i < 10; i++) {
    const { ok } = checkRateLimit(ip);
    assertEquals(ok, true, `request ${i + 1} should be allowed`);
  }
  const { ok, retryAfter } = checkRateLimit(ip);
  assertEquals(ok, false, "11th request should be blocked");
  if (retryAfter === undefined || retryAfter <= 0) {
    throw new Error(`retryAfter should be a positive number, got ${retryAfter}`);
  }
});

Deno.test("checkRateLimit: independent buckets per IP", () => {
  const ipA = `test-A-${crypto.randomUUID()}`;
  const ipB = `test-B-${crypto.randomUUID()}`;
  for (let i = 0; i < 10; i++) checkRateLimit(ipA);
  const { ok } = checkRateLimit(ipB);
  assertEquals(ok, true, "new IP should not inherit another IP's bucket");
});
