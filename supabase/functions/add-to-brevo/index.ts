import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";
import { checkRateLimit, getClientIp } from "../_shared/rate-limit.ts";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BREVO_LIST_ID = 6; // early_adopt2

interface BrevoRequest {
  email: string;
  turnstileToken: string;
}

function jsonResponse(body: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

const handler = async (req: Request): Promise<Response> => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;
  const cors = buildCorsHeaders(req);

  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": String(rl.retryAfter ?? 60), ...cors },
    });
  }

  let payload: BrevoRequest;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, cors);
  }

  const { email, turnstileToken } = payload;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email) || email.length > 255) {
    return jsonResponse({ error: "Invalid email" }, 400, cors);
  }

  const turnstileOk = await verifyTurnstile(turnstileToken ?? "", ip);
  if (!turnstileOk) {
    return jsonResponse({ error: "Captcha verification failed" }, 403, cors);
  }

  const brevoApiKey = Deno.env.get("BREVO_API_KEY");
  if (!brevoApiKey) {
    console.error("BREVO_API_KEY is not configured");
    return jsonResponse({ error: "Service configuration error" }, 500, cors);
  }

  // Try to create the contact (Brevo returns 400 duplicate_parameter if already exists).
  const createResponse = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": brevoApiKey,
    },
    body: JSON.stringify({
      email,
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
      attributes: { EARLY_ADOPTER: true, SIGNUP_DATE: new Date().toISOString() },
    }),
  });

  if (createResponse.ok) {
    // Response body is intentionally identical to the duplicate path below to avoid an
    // email-enumeration oracle (attacker can't distinguish new vs existing email).
    return jsonResponse({ message: "ok" }, 200, cors);
  }

  // Read the error to decide recovery path. Don't leak it to the client.
  let errorBody: { code?: string } = {};
  try {
    errorBody = await createResponse.json();
  } catch {
    // Non-JSON response body; treat as generic failure.
  }

  if (createResponse.status === 400 && errorBody.code === "duplicate_parameter") {
    // Contact already exists. Re-add to list AND refresh attributes.
    // Both calls must succeed to guarantee list membership — do not short-circuit on one.
    const [addToListRes, updateRes] = await Promise.all([
      fetch(`https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}/contacts/add`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({ emails: [email] }),
      }),
      fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "api-key": brevoApiKey,
        },
        body: JSON.stringify({
          listIds: [BREVO_LIST_ID],
          attributes: { EARLY_ADOPTER: true, SIGNUP_DATE: new Date().toISOString() },
        }),
      }),
    ]);

    // Brevo's "add contact to list" endpoint returns 201 on success OR 400
    // `"Contact already in list"` if already a member; treat 400 as success for our purposes.
    const addOk = addToListRes.ok || addToListRes.status === 400;
    const updateOk = updateRes.ok;

    // Require list membership. Attribute update is best-effort — list membership is the SLA.
    if (!addOk) {
      console.error("Brevo list-add failed", addToListRes.status);
      return jsonResponse({ error: "Failed to subscribe. Please try again." }, 502, cors);
    }
    if (!updateOk) {
      console.warn("Brevo attribute update failed but list-add succeeded", updateRes.status);
    }

    return jsonResponse({ message: "ok" }, 200, cors);
  }

  console.error("Brevo API error", createResponse.status);
  return jsonResponse({ error: "Failed to subscribe. Please try again." }, 502, cors);
};

serve(handler);
