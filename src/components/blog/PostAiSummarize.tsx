import { useLanguage } from "@/contexts/LanguageContext";
import { SITE_URL } from "@/seo/routes";

/**
 * "Too long, ask AI" CTA block. Renders at the top of every post, right
 * after the breadcrumb. Deep-links into the 5 consumer AI surfaces the
 * footer already wires up (ChatGPT, Claude, Perplexity, Google AI Mode,
 * Grok). Each prompt is customized per post so the AI summarizes THIS
 * article, not the Fleuret homepage.
 *
 * Design matches the footer's askAi cluster: white-alpha icon chips,
 * `text-white/60` prompt copy, no heavy borders. Sits above the headline
 * so a reader hitting the page can punt to AI before scrolling.
 */

type Language = "fr" | "en";

const providers = [
  {
    name: "ChatGPT",
    logo: "/ai-logos/openai.svg",
    url: (q: string) => `https://chat.openai.com/?q=${q}`,
  },
  {
    name: "Claude",
    logo: "/ai-logos/claude.svg",
    url: (q: string) => `https://claude.ai/new?q=${q}`,
  },
  {
    name: "Perplexity",
    logo: "/ai-logos/perplexity.svg",
    url: (q: string) => `https://www.perplexity.ai/search/new?q=${q}`,
  },
  {
    name: "Google AI",
    logo: "/ai-logos/google.svg",
    url: (q: string) =>
      `https://www.google.com/search?udm=50&aep=11&q=${q}`,
  },
  {
    name: "Grok",
    logo: "/ai-logos/grok.svg",
    url: (q: string) => `https://x.com/i/grok?text=${q}`,
  },
] as const;

function buildPrompt(language: Language, title: string, url: string): string {
  if (language === "fr") {
    return `Résume cet article du blog Fleuret en 5 points clés pour un RSSI pressé. Article : "${title}" — ${url}. Donne les 3 à 5 idées principales, les chiffres cités, et la recommandation pratique pour un responsable sécurité. Si des concepts techniques (NIS2, DORA, IA agentique, pentest continu) sont mentionnés, explique-les brièvement.`;
  }
  return `Summarize this article from the Fleuret blog in 5 bullet points for a busy CISO. Article: "${title}" — ${url}. Give the 3 to 5 main ideas, any numbers cited, and the practical takeaway for a security leader. If technical concepts (NIS2, DORA, agentic AI, continuous pentesting) appear, explain them briefly.`;
}

export function PostAiSummarize({
  title,
  path,
  className = "",
}: {
  title: string;
  path: string;
  className?: string;
}) {
  const { language, t } = useLanguage();
  const url = SITE_URL + path;
  const prompt = encodeURIComponent(
    buildPrompt(language as Language, title, url),
  );

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 ${className}`}
      role="complementary"
      aria-label={t("blog.askAi.aria")}
    >
      <div className="flex flex-col items-center sm:items-start sm:flex-1 sm:min-w-0">
        <p className="text-xs uppercase tracking-widest text-white/40">
          {t("blog.askAi.tldr")}
        </p>
        <p className="text-sm font-light text-white/70 leading-snug">
          {t("blog.askAi.prompt")}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {providers.map((p) => (
          <a
            key={p.name}
            href={p.url(prompt)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t("footer.openIn")} ${p.name}`}
            title={p.name}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:border-white/20 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <img
              src={p.logo}
              alt=""
              className="h-4 w-4 object-contain"
              aria-hidden="true"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
