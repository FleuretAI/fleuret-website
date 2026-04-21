// Explicit `.js` extension: this module is reached transitively from
// `api/apply.ts`, which @vercel/node compiles with moduleResolution=node16.
// PR #50 added `.js` extensions to api/*.ts but missed this intermediate
// hop, so api/apply.ts still failed TS2835 at deploy and shipped as a
// broken lambda (falling through to the static 404).
import type { ApplicationInput, CompanySize, Role } from "./designPartnerSchema.js";

const QUALIFIED_ROLES: ReadonlySet<Role> = new Set([
  "ciso",
  "security_lead",
  "cto",
  "ceo",
  "dpo",
]);

const QUALIFIED_SIZES: ReadonlySet<CompanySize> = new Set([
  "50-99",
  "100-499",
  "500-999",
  "1000+",
]);

export function isQualified(
  input: Pick<ApplicationInput, "role" | "companySize">,
): boolean {
  return QUALIFIED_ROLES.has(input.role) && QUALIFIED_SIZES.has(input.companySize);
}
