import { z } from "zod";

export const ROLE_VALUES = [
  "ciso",
  "security_lead",
  "devops_lead",
  "cto",
  "ceo",
  "dpo",
  "other",
] as const;

export const COMPANY_SIZE_VALUES = [
  "<50",
  "50-99",
  "100-499",
  "500-999",
  "1000+",
] as const;

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

export const applicationSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  role: z.enum(ROLE_VALUES),
  company: z.string().trim().max(200).optional(),
  companySize: z.enum(COMPANY_SIZE_VALUES),
  primaryAsset: z.string().trim().min(3).max(280),
  consent: z.literal(true, {
    errorMap: () => ({ message: "consent_required" }),
  }),
  submissionId: z.string().uuid(),
  locale: z.enum(["fr", "en"]).optional(),
  utm: utmSchema,
  referrer: z.string().trim().max(500).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type Role = (typeof ROLE_VALUES)[number];
export type CompanySize = (typeof COMPANY_SIZE_VALUES)[number];
