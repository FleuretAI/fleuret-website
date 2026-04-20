import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PostMeta } from "@/content/post-schema";

/**
 * Editorial row for /blog index. Grid-based layout: date left, title+excerpt
 * middle, reading time right on desktop. Stacks on mobile. Full-row link.
 *
 *   +--------+------------------------------+---------+
 *   | DATE   | TITLE                        | 8 min   |
 *   |        | 2-line excerpt in muted ...  |         |
 *   +--------+------------------------------+---------+
 *     (md+ grid-cols-[90px_1fr_60px]; sm stacks)
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
      className="group block border-t border-border/40 py-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[--accent-red] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="grid gap-3 md:grid-cols-[90px_1fr_80px] md:gap-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground md:pt-1">
          <time dateTime={post.date}>{shortDate}</time>
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold leading-snug text-foreground transition-colors group-hover:text-[--accent-red]">
            {post.title}
          </h2>
          <p className="mt-2 text-base text-muted-foreground line-clamp-2">
            {post.description}
          </p>
        </div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground md:pt-1 md:text-right">
          {post.readingTimeMinutes} {t("blog.readingTime")}
        </div>
      </div>
    </Link>
  );
}
