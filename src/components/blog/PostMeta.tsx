import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Compact meta row for post pages and index rows.
 * Renders: date · author · reading time (separator dots dimmed).
 */
export function PostMeta({
  date,
  author,
  readingTimeMinutes,
  className = "",
}: {
  date: string; // ISO YYYY-MM-DD
  author: string;
  readingTimeMinutes: number;
  className?: string;
}) {
  const { language, t } = useLanguage();
  const dt = new Date(date + "T00:00:00Z");
  const formatted = dt.toLocaleDateString(
    language === "fr" ? "fr-FR" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  );
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground uppercase tracking-wide ${className}`}
    >
      <time dateTime={date}>{formatted}</time>
      <span aria-hidden="true" className="text-muted-foreground/40">
        ·
      </span>
      <span>{author}</span>
      <span aria-hidden="true" className="text-muted-foreground/40">
        ·
      </span>
      <span>
        {readingTimeMinutes} {t("blog.readingTime")}
      </span>
    </div>
  );
}
