import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Compact meta row for post pages: date - author - reading time. Uses
 * white-alpha color scale (same as About/Careers subtitles) instead of
 * shadcn muted-foreground, so the meta reads as continuous with the rest
 * of the site. Separator dots dimmed at white/20.
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
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-light text-white/50 ${className}`}
    >
      <time dateTime={date}>{formatted}</time>
      <span aria-hidden="true" className="text-white/20">
        ·
      </span>
      <span>{author}</span>
      <span aria-hidden="true" className="text-white/20">
        ·
      </span>
      <span>
        {readingTimeMinutes} {t("blog.readingTime")}
      </span>
    </div>
  );
}
