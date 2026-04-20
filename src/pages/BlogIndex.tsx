import { SEO } from "@/seo/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { listPosts } from "@/content/posts.generated";
import { PostRow } from "@/components/blog/PostRow";

/**
 * /blog — editorial list page. No card grid, no tag filter (deferred).
 * Posts are pre-sorted by listPosts(locale) in the generated registry.
 */
const BlogIndex = () => {
  const { t, language } = useLanguage();
  const posts = listPosts(language);
  return (
    <>
      <SEO pageKey="blog" />
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-10">
        <div className="max-w-[960px] mx-auto">
          <header className="mb-12 md:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              {t("blog.hero.title")}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              {t("blog.hero.subtitle")}
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              {t("blog.empty")}
            </p>
          ) : (
            <div>
              {posts.map((p) => (
                <PostRow key={`${p.locale}:${p.slug}`} post={p} />
              ))}
              {/* closing divider */}
              <div className="border-t border-border/40" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogIndex;
