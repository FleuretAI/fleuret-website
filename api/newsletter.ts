import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash } from "node:crypto";
import {
  newsletterSchema,
  NEWSLETTER_CONSENT_VERSION,
  type NewsletterInput,
} from "../src/lib/newsletterSchema.js";
import { serverSupabase } from "./_lib/supabase.js";

export const config = {
  runtime: "nodejs",
  regions: ["fra1"],
};

function clientIpHash(req: VercelRequest): string {
  const fwd = (req.headers["x-forwarded-for"] as string) ?? "";
  const ip = fwd.split(",")[0]?.trim() || (req.socket?.remoteAddress ?? "unknown");
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  let parsed: NewsletterInput;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    // Honeypot: hidden "website" field must be empty
    if (body && typeof body.website === "string" && body.website.trim() !== "") {
      return res.status(200).json({ ok: true });
    }
    parsed = newsletterSchema.parse(body) as NewsletterInput;
  } catch (err) {
    return res.status(400).json({
      error: "validation_failed",
      issues: err instanceof Error ? err.message : "invalid input",
    });
  }

  const supabase = serverSupabase();

  const { error } = await supabase.from("newsletter_subscriptions").insert({
    email: parsed.email,
    consent_marketing: parsed.consent,
    consent_version: NEWSLETTER_CONSENT_VERSION,
    utm_source: parsed.utm?.source ?? null,
    utm_medium: parsed.utm?.medium ?? null,
    utm_campaign: parsed.utm?.campaign ?? null,
    utm_content: parsed.utm?.content ?? null,
    utm_term: parsed.utm?.term ?? null,
    referrer: parsed.referrer ?? null,
    source_path: parsed.sourcePath ?? null,
    locale: parsed.locale ?? null,
    client_ip_hash: clientIpHash(req),
    client_submission_id: parsed.submissionId,
  });

  if (error) {
    // Duplicate submissionId → treat as success (idempotent)
    if (error.code === "23505") {
      return res.status(200).json({ ok: true, duplicate: true });
    }
    return res.status(500).json({ error: "database_error" });
  }

  return res.status(200).json({ ok: true });
}
