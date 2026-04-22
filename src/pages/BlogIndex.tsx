import { SEO } from "@/seo/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { listPosts } from "@/content/posts.generated";
import { PostRow } from "@/components/blog/PostRow";

/**
 * /blog — editorial list page. Typography pattern follows About.tsx /
 * Careers.tsx: pt-32/pb-20 main, centered hero, font-light H1 with
 * gradient highlight, text-white/50 subtitle. Post rows share the same
 * type weight so the page reads as one document.
 */
const BlogIndex = () => {
  const { t, language } = useLanguage();
  const posts = listPosts(language);
  return (
    <>
      <SEO pageKey="blog" />
      <Navbar />
      <main id="main-content" className="pt-40 md:pt-48 pb-20">
        <section className="container mx-auto px-4 text-center mb-16 md:mb-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
                <span className="text-gradient-accent">{t("blog.hero.title")}</span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                {t("blog.hero.subtitle")}
              </p>
            </div>
          </ScrollReveal>
        </section>

        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-3xl mx-auto">
            {posts.length === 0 ? (
              <p className="py-12 text-center font-light text-white/50">
                {t("blog.empty")}
              </p>
            ) : (
              <div>
                {posts.map((p) => (
                  <PostRow key={`${p.locale}:${p.slug}`} post={p} />
                ))}
                <div className="border-t border-white/10" />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BlogIndex;
