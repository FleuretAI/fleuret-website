import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PostMeta } from "@/content/post-schema";

/**
 * Editorial row for /blog index. Type weight + color match About.tsx and
 * Careers.tsx conventions: font-light on title, white / white-alpha for
 * hierarchy instead of shadcn tokens. Grid-based layout: date left,
 * title+excerpt middle, reading time right on desktop. Stacks on mobile.
 */
export function PostRow({ post }: { post: PostMeta }) {
  const { language, t } = useLanguage();
  const dt = new Date(post.date + "T00:00:00Z");
  const shortDate = dt.toLocaleDateString(
    language === "fr" ? "fr-FR" : "en-US",
    { day: "2-digit", month: "short", year: "numeric" },
  );

  return (
    <Link
      to={post.path}
      className="group block border-t border-white/10 py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="grid gap-3 md:grid-cols-[96px_1fr_80px] md:gap-6">
        <div className="text-xs uppercase tracking-widest text-white/40 md:pt-2">
          <time dateTime={post.date}>{shortDate}</time>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-light leading-snug text-white transition-colors group-hover:text-white/80">
            {post.title}
          </h2>
          <p className="mt-2 text-base font-light text-white/55 leading-relaxed line-clamp-2">
            {post.description}
          </p>
        </div>
        <div className="text-xs uppercase tracking-widest text-white/40 md:pt-2 md:text-right">
          {post.readingTimeMinutes} {t("blog.readingTime")}
        </div>
      </div>
    </Link>
  );
}
