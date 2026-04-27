import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/seo/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import changelogRaw from "../../CHANGELOG.md?raw";
import { parseChangelog, type ChangelogVersion } from "@/lib/parseChangelog";

const Changelog = () => {
  const { t, localize } = useLanguage();
  const versions = useMemo<ChangelogVersion[]>(() => parseChangelog(changelogRaw), []);

  return (
    <div className="min-h-screen">
      <SEO pageKey="changelog" />
      <Navbar />
      <main id="main-content" className="pt-40 md:pt-48 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to={localize("/")}
            className="text-[var(--accent-blue)] hover:underline text-sm inline-block mb-8"
          >
            {t("common.back")}
          </Link>

          <h1 className="text-3xl md:text-4xl font-light text-white mb-2 tracking-tight">
            {t("changelog.title")}
          </h1>
          <p className="text-white/50 text-base mb-12">
            {t("changelog.subtitle")}
          </p>

          {versions.length === 0 ? (
            <p className="text-white/40 italic">{t("changelog.empty")}</p>
          ) : (
            <ol className="space-y-16 list-none p-0">
              {versions.map((version) => (
                <li key={version.id} id={version.id}>
                  <header className="mb-6 pb-3 border-b border-white/10">
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                      {version.label}
                    </h2>
                    {version.date && (
                      <time className="block mt-1 text-xs uppercase tracking-[0.2em] text-white/30">
                        {version.date}
                      </time>
                    )}
                  </header>

                  {version.sections.map((section) => (
                    <section key={section.kind} className="mb-8 last:mb-0">
                      <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--accent-blue)] mb-4">
                        {t(`changelog.kind.${section.kind.toLowerCase()}`)}
                      </h3>
                      <ul className="space-y-3 list-none p-0">
                        {section.items.map((item, i) => (
                          <li
                            key={i}
                            className="text-white/70 leading-relaxed text-sm pl-4 border-l border-white/10"
                            dangerouslySetInnerHTML={{ __html: item.html }}
                          />
                        ))}
                      </ul>
                    </section>
                  ))}
                </li>
              ))}
            </ol>
          )}

          <p className="mt-20 text-white/30 text-xs">
            {t("changelog.source")}{" "}
            <a
              href="https://github.com/FleuretAI/fleuret-website/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-blue)] hover:underline"
            >
              CHANGELOG.md
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Changelog;
