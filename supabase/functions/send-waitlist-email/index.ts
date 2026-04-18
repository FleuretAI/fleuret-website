import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { buildCorsHeaders, handlePreflight } from "../_shared/cors.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";
import { checkRateLimit, getClientIp } from "../_shared/rate-limit.ts";
import { escapeHtml } from "../_shared/escape-html.ts";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface WaitlistRequest {
  name: string;
  email: string;
  company?: string;
  position?: string;
  message?: string;
  turnstileToken: string;
}

function jsonResponse(body: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

function validateLength(value: unknown, max: number): boolean {
  return typeof value === "string" && value.length > 0 && value.length <= max;
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

  let payload: WaitlistRequest;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400, cors);
  }

  const { name, email, company, position, message, turnstileToken } = payload;

  if (!validateLength(name, 200) || !validateLength(email, 255) || !EMAIL_REGEX.test(email)) {
    return jsonResponse({ error: "Invalid input" }, 400, cors);
  }
  if (company !== undefined && !validateLength(company, 200)) return jsonResponse({ error: "Invalid input" }, 400, cors);
  if (position !== undefined && !validateLength(position, 200)) return jsonResponse({ error: "Invalid input" }, 400, cors);
  if (message !== undefined && typeof message === "string" && message.length > 5000) {
    return jsonResponse({ error: "Invalid input" }, 400, cors);
  }

  const turnstileOk = await verifyTurnstile(turnstileToken ?? "", ip);
  if (!turnstileOk) {
    return jsonResponse({ error: "Captcha verification failed" }, 403, cors);
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const recipient = Deno.env.get("RECIPIENT_EMAIL");
  const fromAddress = Deno.env.get("FROM_EMAIL") ?? "Fleuret Waitlist <onboarding@resend.dev>";

  if (!resendKey || !recipient) {
    console.error("RESEND_API_KEY or RECIPIENT_EMAIL not configured");
    return jsonResponse({ error: "Service configuration error" }, 500, cors);
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeCompany = company ? escapeHtml(company) : "";
  const safePosition = position ? escapeHtml(position) : "";
  const safeMessage = message ? escapeHtml(message).replace(/\n/g, "<br>") : "";

  const parts = [
    "<h2>Nouvelle inscription à la waitlist Fleuret</h2>",
    `<p><strong>Nom :</strong> ${safeName}</p>`,
    `<p><strong>Email :</strong> ${safeEmail}</p>`,
  ];
  if (safeCompany) parts.push(`<p><strong>Entreprise :</strong> ${safeCompany}</p>`);
  if (safePosition) parts.push(`<p><strong>Poste :</strong> ${safePosition}</p>`);
  if (safeMessage) parts.push(`<p><strong>Message :</strong></p><p>${safeMessage}</p>`);
  parts.push(`<hr><p style="color:#666;font-size:12px;">Date: ${escapeHtml(new Date().toLocaleString("fr-FR"))}</p>`);
  const emailContent = parts.join("");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: fromAddress,
      to: [recipient],
      subject: `Nouvelle inscription waitlist - ${safeName}`,
      html: emailContent,
    }),
  });

  if (!resendResponse.ok) {
    console.error("Resend API error", resendResponse.status);
    return jsonResponse({ error: "Failed to send notification" }, 502, cors);
  }

  return jsonResponse({ success: true }, 200, cors);
};

serve(handler);
