import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCountdown } from "@/lib/useCountdown";
import { DP_COHORT_START_ISO } from "@/lib/designPartnerConfig";

export function CohortCountdown() {
  const { t, language } = useLanguage();
  const { days, hours, minutes, expired } = useCountdown(DP_COHORT_START_ISO);

  const humanDate = useMemo(() => {
    const d = new Date(DP_COHORT_START_ISO);
    return d.toLocaleDateString(language === "fr" ? "fr-FR" : "en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Europe/Paris",
    });
  }, [language]);

  if (expired) {
    return (
      <div
        className="inline-flex items-center gap-2 text-sm text-white/70"
        aria-live="polite"
      >
        <span className="w-2 h-2 rounded-full bg-white/50" aria-hidden="true" />
        {t("designPartners.countdown.started")}
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-baseline gap-3 text-white/80"
      aria-label={t("designPartners.countdown.aria")
        .replace("{days}", String(days))
        .replace("{hours}", String(hours))
        .replace("{minutes}", String(minutes))}
      aria-live="polite"
    >
      <span className="text-sm text-white/60">
        {t("designPartners.countdown.prefix").replace("{date}", humanDate)}
      </span>
      <span className="motion-reduce:hidden text-base font-medium tabular-nums">
        {days}
        <span className="text-white/50 ml-0.5 text-xs">
          {t("designPartners.countdown.d")}
        </span>
        <span className="ml-2">{String(hours).padStart(2, "0")}</span>
        <span className="text-white/50 ml-0.5 text-xs">
          {t("designPartners.countdown.h")}
        </span>
        <span className="ml-2">{String(minutes).padStart(2, "0")}</span>
        <span className="text-white/50 ml-0.5 text-xs">
          {t("designPartners.countdown.m")}
        </span>
      </span>
    </div>
  );
}
