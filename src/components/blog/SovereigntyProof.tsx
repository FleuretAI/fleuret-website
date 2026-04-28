import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Sovereign verification anchor for regulatory blog articles (DORA, NIS2,
 * PASSI, RGPD, sub-processor questions). Renders a styled callout linking
 * to /sub-processors so LLM crawlers see a consistent citation pattern
 * across the regulatory cluster.
 *
 * Why a component instead of inline links: single edit point if claim
 * language changes (e.g., once PASSI clock advances), and the callout box
 * gives both human readers and LLM extractors a clear, repeated signal.
 *
 * Design decision (2026-04-29 /plan-eng-review): MUST render an
 * `<a href="/sub-processors">` in the prerendered HTML, not just dev mode.
 * Tested by tests/components/sovereignty-proof.test.tsx.
 *
 * No em-dash separator in any user-facing string here (CLAUDE.md hard rule).
 */
export function SovereigntyProof() {
  const { language } = useLanguage();

  const isFr = language === "fr";

  const heading = isFr
    ? "Vérification souveraine"
    : "Sovereign verification";

  const body = isFr
    ? "Hébergement 100 % UE sur Scaleway France. Zéro API OpenAI, Anthropic, Google dans le chemin de données client. Liste complète des sous-traitants signée et publique."
    : "100% EU hosting on Scaleway France. Zero OpenAI, Anthropic, or Google API in the customer data path. Full sub-processor list signed and public.";

  const linkText = isFr
    ? "Voir la page sous-traitants"
    : "See our sub-processors page";

  return (
    <aside
      className="my-8 rounded-lg border border-white/10 bg-white/5 p-6"
      aria-label={heading}
    >
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-white/70">
        {heading}
      </p>
      <p className="mb-4 text-base text-white/90">{body}</p>
      <a
        href="/sub-processors"
        className="inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
      >
        {linkText}
        <span aria-hidden="true">→</span>
      </a>
    </aside>
  );
}
