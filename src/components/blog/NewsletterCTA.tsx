import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { captureUtm } from "@/lib/captureUtm";
import { trackCTAClick } from "@/lib/gtag";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

function newSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

interface Props {
  /**
   * Where this CTA is rendered. Sent to the API as `source_path` so we can
   * attribute conversions to the post or page. Default = current pathname.
   */
  sourcePath?: string;
  /** Tracking label for GA4. Defaults to "blog_post_footer". */
  trackingLocation?: string;
}

export function NewsletterCTA({ sourcePath, trackingLocation = "blog_post_footer" }: Props) {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const submissionIdRef = useRef<string>(newSubmissionId());
  const formId = useId();
  const emailErrId = `${formId}-email-err`;
  const consentErrId = `${formId}-consent-err`;

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);

  const emailInvalid = touched && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const consentInvalid = touched && !consent;

  const utm = useMemo(
    () => (typeof window === "undefined" ? {} : captureUtm(window.location.search)),
    [],
  );
  const referrer = typeof document === "undefined" ? "" : document.referrer;
  const resolvedSourcePath = useMemo(() => {
    if (sourcePath) return sourcePath;
    return typeof window === "undefined" ? "" : window.location.pathname;
  }, [sourcePath]);

  const submitting = status.kind === "submitting";

  // Reset the submissionId after a successful submit so the next subscriber
  // on the same SPA session (rare but possible) is not a duplicate.
  useEffect(() => {
    if (status.kind === "success") {
      submissionIdRef.current = newSubmissionId();
    }
  }, [status.kind]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (emailInvalid || consentInvalid || !email || !consent) {
      return;
    }
    setStatus({ kind: "submitting" });
    trackCTAClick({
      location: trackingLocation,
      label: "newsletter_subscribe",
      destination: "/api/newsletter",
    });

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          consent: true,
          submissionId: submissionIdRef.current,
          locale: language,
          sourcePath: resolvedSourcePath,
          utm,
          referrer,
          website: "", // honeypot
        }),
      });
      if (!res.ok) {
        setStatus({ kind: "error", message: t("newsletter.error.network") });
        return;
      }
      setStatus({ kind: "success" });
    } catch {
      setStatus({ kind: "error", message: t("newsletter.error.network") });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 text-center"
      >
        <h2 className="text-xl md:text-2xl font-light text-white mb-2">
          {t("newsletter.success.title")}
        </h2>
        <p className="text-sm text-white/60">{t("newsletter.success.body")}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby={`${formId}-title`}
      className="max-w-xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
    >
      <h2 id={`${formId}-title`} className="text-xl md:text-2xl font-light text-white mb-2">
        {t("newsletter.title")}
      </h2>
      <p className="text-sm text-white/60 mb-5">{t("newsletter.subtitle")}</p>

      <label htmlFor={`${formId}-email`} className="sr-only">
        {t("newsletter.emailLabel")}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={`${formId}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={t("newsletter.emailPlaceholder")}
          aria-invalid={emailInvalid || undefined}
          aria-describedby={emailInvalid ? emailErrId : undefined}
          className="flex-1 rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-white/30"
        />
        <button
          type="submit"
          disabled={submitting}
          className="btn-cta disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? t("newsletter.ctaLoading") : t("newsletter.cta")}
        </button>
      </div>
      {emailInvalid && (
        <p id={emailErrId} role="alert" className="mt-2 text-xs text-red-300">
          {t("newsletter.error.email")}
        </p>
      )}

      <label className="mt-4 flex items-start gap-2 text-xs text-white/55 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-invalid={consentInvalid || undefined}
          aria-describedby={consentInvalid ? consentErrId : undefined}
          className="mt-0.5 accent-white"
        />
        <span>{t("newsletter.consent")}</span>
      </label>
      {consentInvalid && (
        <p id={consentErrId} role="alert" className="mt-1 text-xs text-red-300">
          {t("newsletter.error.consent")}
        </p>
      )}

      {/* Honeypot — hidden from humans, bots fill it */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-0 h-0 opacity-0 pointer-events-none"
      />

      {status.kind === "error" && (
        <p role="alert" className="mt-3 text-xs text-red-300">
          {status.message}
        </p>
      )}
    </form>
  );
}
