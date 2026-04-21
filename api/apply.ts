import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash } from "node:crypto";
// Explicit `.js` extensions on relative imports: @vercel/node compiles this
// file with moduleResolution=node16/nodenext which REQUIRES extensions, even
// though tsconfig.api.json declares `bundler`. TS emits files as `.js`, so
// we import with `.js` regardless of source extension.
import { applicationSchema, type ApplicationInput } from "../src/lib/designPartnerSchema.js";
import { isQualified } from "../src/lib/designPartnerQualify.js";
import { serverSupabase } from "./_lib/supabase.js";
import { DEMO_SCHEDULER_SHORT_URL } from "../src/lib/routes.js";

export const config = {
  runtime: "nodejs",
  regions: ["fra1"],
};

const CONSENT_VERSION = "2026-04-20";

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

  let parsed: ApplicationInput;
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    // Honeypot: hidden "website" field must be empty
    if (body && typeof body.website === "string" && body.website.trim() !== "") {
      // Silent accept (don't let bots learn they're blocked)
      return res.status(200).json({ ok: true, qualified: false });
    }
    parsed = applicationSchema.parse(body) as ApplicationInput;
  } catch (err) {
    return res.status(400).json({
      error: "validation_failed",
      issues: err instanceof Error ? err.message : "invalid input",
    });
  }

  const qualified = isQualified(parsed);
  const supabase = serverSupabase();

  const { error } = await supabase.from("design_partner_applications").insert({
    email: parsed.email,
    role: parsed.role,
    company: parsed.company ?? null,
    company_size: parsed.companySize,
    primary_asset: parsed.primaryAsset,
    consent_contact: parsed.consent,
    consent_version: CONSENT_VERSION,
    utm_source: parsed.utm?.source ?? null,
    utm_medium: parsed.utm?.medium ?? null,
    utm_campaign: parsed.utm?.campaign ?? null,
    utm_content: parsed.utm?.content ?? null,
    utm_term: parsed.utm?.term ?? null,
    referrer: parsed.referrer ?? null,
    locale: parsed.locale ?? null,
    qualified,
    status: qualified ? "applied" : "unqualified",
    client_ip_hash: clientIpHash(req),
    client_submission_id: parsed.submissionId,
  });

  if (error) {
    // Duplicate submission (idempotency) -> treat as success
    if (error.code === "23505") {
      return res.status(200).json({
        ok: true,
        qualified,
        calendarUrl: qualified ? DEMO_SCHEDULER_SHORT_URL : null,
        duplicate: true,
      });
    }
    return res.status(500).json({ error: "database_error" });
  }

  return res.status(200).json({
    ok: true,
    qualified,
    calendarUrl: qualified ? DEMO_SCHEDULER_SHORT_URL : null,
  });
}
