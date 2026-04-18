// Best-effort in-memory sliding-window rate limiter. Scope: per edge-function isolate.
// Across isolates the count will not be coordinated — good enough to slow down
// naive scripting, not a hard gate. For production-grade limits, swap for Upstash
// Redis or a Supabase table with atomic upsert.
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type Stamp = number;
const buckets = new Map<string, Stamp[]>();

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const stamps = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (stamps.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((WINDOW_MS - (now - stamps[0])) / 1000);
    buckets.set(ip, stamps);
    return { ok: false, retryAfter };
  }
  stamps.push(now);
  buckets.set(ip, stamps);

  if (buckets.size > 10_000) {
    for (const [key, s] of buckets) {
      if (s.every((t) => now - t >= WINDOW_MS)) buckets.delete(key);
    }
  }
  return { ok: true };
}
