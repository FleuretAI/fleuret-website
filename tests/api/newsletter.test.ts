import { describe, expect, it, vi, beforeEach } from "vitest";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const insertMock = vi.fn();

vi.mock("../../api/_lib/supabase.js", () => ({
  serverSupabase: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

// Import after vi.mock — vitest hoists the mock above the import, but
// keeping the order explicit avoids future-reader surprise.
import handler from "../../api/newsletter";

const VALID_UUID = "6f0a0c28-8a8a-4d4b-a0a0-1111aaaa2222";

function makeReq(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: "POST",
    headers: {},
    socket: { remoteAddress: "127.0.0.1" },
    body: {
      email: "subscriber@example.com",
      consent: true,
      submissionId: VALID_UUID,
      locale: "en",
      sourcePath: "/blog/post",
      utm: { source: "linkedin" },
      referrer: "https://example.com",
      website: "",
    },
    ...overrides,
  } as unknown as VercelRequest;
}

function makeRes() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    status: vi.fn(function (this: typeof res, code: number) {
      this.statusCode = code;
      return this;
    }),
    json: vi.fn(function (this: typeof res, payload: unknown) {
      this.body = payload;
      return this;
    }),
    setHeader: vi.fn(function (this: typeof res, name: string, value: string) {
      this.headers[name] = value;
      return this;
    }),
  };
  return res as unknown as VercelResponse & typeof res;
}

beforeEach(() => {
  insertMock.mockReset();
  insertMock.mockResolvedValue({ error: null });
});

describe("api/newsletter handler", () => {
  it("returns 405 + Allow header on non-POST", async () => {
    const req = makeReq({ method: "GET" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ error: "method_not_allowed" });
    expect(res.headers["Allow"]).toBe("POST");
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns 200 + inserts row on a valid POST", async () => {
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledTimes(1);
    const inserted = insertMock.mock.calls[0]?.[0];
    expect(inserted.email).toBe("subscriber@example.com");
    expect(inserted.consent_marketing).toBe(true);
    expect(inserted.consent_version).toBe("2026-05-17");
    expect(inserted.utm_source).toBe("linkedin");
    expect(inserted.client_submission_id).toBe(VALID_UUID);
    // Hashed IP, never the raw value.
    expect(inserted.client_ip_hash).toMatch(/^[0-9a-f]{32}$/);
    expect(inserted.client_ip_hash).not.toBe("127.0.0.1");
  });

  it("returns 400 validation_failed on a bad email", async () => {
    const req = makeReq({ body: { ...makeReq().body, email: "not-an-email" } });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect((res.body as { error: string }).error).toBe("validation_failed");
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns 400 validation_failed when consent is false", async () => {
    const req = makeReq({ body: { ...makeReq().body, consent: false } });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns 400 on a missing submissionId", async () => {
    const body = { ...makeReq().body } as Record<string, unknown>;
    delete body.submissionId;
    const req = makeReq({ body });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("returns 200 + duplicate:true when supabase reports unique-violation 23505", async () => {
    insertMock.mockResolvedValueOnce({ error: { code: "23505" } });
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, duplicate: true });
  });

  it("returns 500 database_error on a non-23505 supabase failure", async () => {
    insertMock.mockResolvedValueOnce({ error: { code: "42P01", message: "missing table" } });
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "database_error" });
  });

  it("swallows honeypot hits with a fake 200 and never touches supabase", async () => {
    const req = makeReq({ body: { ...makeReq().body, website: "spam-bot.com" } });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("parses a string-typed body (vercel raw-body fallback)", async () => {
    const req = makeReq({ body: JSON.stringify(makeReq().body) });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  it("hashes the x-forwarded-for first hop when present", async () => {
    const req = makeReq({
      headers: { "x-forwarded-for": "203.0.113.42, 70.41.3.18" },
    });
    const res = makeRes();
    await handler(req, res);
    const inserted = insertMock.mock.calls[0]?.[0];
    expect(inserted.client_ip_hash).toMatch(/^[0-9a-f]{32}$/);
    expect(inserted.client_ip_hash).not.toContain("203.0.113.42");
  });
});
