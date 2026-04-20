import { Link } from "react-router-dom";
import { SEO } from "@/seo/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * /resources — hub page. Currently hosts a single "Blog" tile. No "Coming soon"
 * stubs for whitepapers / case studies: stale stubs erode trust more than
 * missing tiles. Add tiles when content exists.
 */
const Resources = () => {
  const { t, localize } = useLanguage();
  return (
    <>
      <SEO pageKey="resources" />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-[1024px] mx-auto">
          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              {t("resources.hero.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              {t("resources.hero.subtitle")}
            </p>
          </header>

          <Link
            to={localize("/blog")}
            className="group block border border-border/60 rounded-xl p-8 md:p-10 transition-colors hover:border-[--accent-red]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent-red] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="text-xs uppercase tracking-widest text-[--accent-red] mb-4">
              {t("resources.blog.label")}
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 transition-colors group-hover:text-[--accent-red]">
              {t("resources.blog.title")}
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mb-6">
              {t("resources.blog.description")}
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[--accent-red] transition-transform group-hover:translate-x-1">
              {t("resources.blog.cta")} →
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Resources;
