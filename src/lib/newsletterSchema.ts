import { z } from "zod";

const utmSchema = z
  .object({
    source: z.string().trim().max(120).optional(),
    medium: z.string().trim().max(120).optional(),
    campaign: z.string().trim().max(120).optional(),
    content: z.string().trim().max(120).optional(),
    term: z.string().trim().max(120).optional(),
  })
  .partial()
  .optional();

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  consent: z.literal(true, { message: "consent_required" }),
  submissionId: z.string().uuid(),
  locale: z.enum(["fr", "en"]).optional(),
  sourcePath: z.string().trim().max(500).optional(),
  utm: utmSchema,
  referrer: z.string().trim().max(500).optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const NEWSLETTER_CONSENT_VERSION = "2026-05-17";
