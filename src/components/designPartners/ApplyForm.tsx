import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { captureUtm } from "@/lib/captureUtm";
import {
  ROLE_VALUES,
  COMPANY_SIZE_VALUES,
  type Role,
  type CompanySize,
} from "@/lib/designPartnerSchema";
import {
  trackApplyBooked,
  trackApplyError,
  trackApplyFormView,
  trackApplyQualified,
  trackApplyStarted,
  trackApplySubmitted,
  trackApplyUnqualified,
} from "@/lib/designPartnerTrack";

type FormStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "qualified"; calendarUrl: string }
  | { kind: "unqualified" }
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

export function ApplyForm() {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<FormStatus>({ kind: "idle" });
  const submissionIdRef = useRef<string>(newSubmissionId());
  const formId = useId();
  const emailErrId = `${formId}-email-err`;
  const assetErrId = `${formId}-asset-err`;
  const consentErrId = `${formId}-consent-err`;

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("ciso");
  const [company, setCompany] = useState("");
  const [companySize, setCompanySize] = useState<CompanySize>("100-499");
  const [primaryAsset, setPrimaryAsset] = useState("");
  const [consent, setConsent] = useState(false);
  const [touched, setTouched] = useState(false);
  const startedRef = useRef(false);
  const viewedRef = useRef(false);

  // Fire `apply_form_view` once per mount lifecycle. React 18 StrictMode
  // double-invokes mount effects in dev; the ref guard makes the second call
  // a no-op so GA only sees one view per real mount.
  useEffect(() => {
    if (viewedRef.current) return;
    viewedRef.current = true;
    trackApplyFormView();
  }, []);

  function fireStartedOnce() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackApplyStarted();
  }

  const emailInvalid = touched && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const assetInvalid = touched && primaryAsset.trim().length < 3;
  const consentInvalid = touched && !consent;

  const utm = useMemo(
    () => (typeof window === "undefined" ? {} : captureUtm(window.location.search)),
    [],
  );
  const referrer = typeof document === "undefined" ? "" : document.referrer;

  const submitting = status.kind === "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (emailInvalid || assetInvalid || consentInvalid) {
      trackApplyError("validation");
      return;
    }
    setStatus({ kind: "submitting" });

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role,
          company: company || undefined,
          companySize,
          primaryAsset,
          consent: true,
          submissionId: submissionIdRef.current,
          locale: language,
          utm,
          referrer,
          website: "", // honeypot
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        trackApplyError(res.status === 400 ? "validation" : "server", res.status);
        setStatus({
          kind: "error",
          message: t(`designPartners.apply.error.${res.status === 400 ? "validation" : "server"}`),
        });
        return;
      }
      trackApplySubmitted(role, companySize);
      if (data?.qualified) {
        trackApplyQualified(role, companySize);
        setStatus({ kind: "qualified", calendarUrl: data.calendarUrl });
      } else {
        trackApplyUnqualified(role, companySize);
        setStatus({ kind: "unqualified" });
      }
    } catch {
      trackApplyError("network");
      setStatus({ kind: "error", message: t("designPartners.apply.error.network") });
    }
  }

  if (status.kind === "qualified") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-6 rounded-2xl border border-[var(--accent-blue)]/30 bg-[var(--accent-blue)]/[0.05] space-y-4"
      >
        <h3 className="text-xl font-medium text-white">
          {t("designPartners.apply.qualifiedTitle")}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">
          {t("designPartners.apply.qualifiedBody")}
        </p>
        <a
          href={status.calendarUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackApplyBooked()}
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
          }}
        >
          {t("designPartners.apply.qualifiedCta")}
        </a>
      </div>
    );
  }

  if (status.kind === "unqualified") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3"
      >
        <h3 className="text-lg font-medium text-white">
          {t("designPartners.apply.unqualifiedTitle")}
        </h3>
        <p className="text-white/60 text-sm leading-relaxed">
          {t("designPartners.apply.unqualifiedBody")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={fireStartedOnce}
      onInput={fireStartedOnce}
      noValidate
      className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/[0.02]"
      aria-describedby={status.kind === "error" ? `${formId}-formerr` : undefined}
    >
      {status.kind === "error" && (
        <div
          id={`${formId}-formerr`}
          role="alert"
          className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-200"
        >
          {status.message}
        </div>
      )}

      <div>
        <label htmlFor={`${formId}-email`} className="block text-sm text-white/70 mb-1.5">
          {t("designPartners.apply.emailLabel")}
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailInvalid}
          aria-describedby={emailInvalid ? emailErrId : undefined}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent-blue)]"
          placeholder={t("designPartners.apply.emailPlaceholder")}
        />
        {emailInvalid && (
          <p id={emailErrId} className="text-xs text-red-300 mt-1">
            {t("designPartners.apply.emailError")}
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${formId}-role`} className="block text-sm text-white/70 mb-1.5">
            {t("designPartners.apply.roleLabel")}
          </label>
          <select
            id={`${formId}-role`}
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-[16px] text-white focus:outline-none focus:border-[var(--accent-blue)]"
          >
            {ROLE_VALUES.map((r) => (
              <option key={r} value={r} className="bg-black">
                {t(`designPartners.apply.role.${r}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${formId}-size`} className="block text-sm text-white/70 mb-1.5">
            {t("designPartners.apply.sizeLabel")}
          </label>
          <select
            id={`${formId}-size`}
            value={companySize}
            onChange={(e) => setCompanySize(e.target.value as CompanySize)}
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-[16px] text-white focus:outline-none focus:border-[var(--accent-blue)]"
          >
            {COMPANY_SIZE_VALUES.map((s) => (
              <option key={s} value={s} className="bg-black">
                {s === "<50"
                  ? t("designPartners.apply.size.lt50")
                  : s === "1000+"
                    ? t("designPartners.apply.size.gt1000")
                    : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-company`} className="block text-sm text-white/70 mb-1.5">
          {t("designPartners.apply.companyLabel")}
        </label>
        <input
          id={`${formId}-company`}
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent-blue)]"
          placeholder={t("designPartners.apply.companyPlaceholder")}
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor={`${formId}-asset`} className="block text-sm text-white/70 mb-1.5">
          {t("designPartners.apply.assetLabel")}
        </label>
        <textarea
          id={`${formId}-asset`}
          required
          rows={2}
          value={primaryAsset}
          onChange={(e) => setPrimaryAsset(e.target.value.slice(0, 280))}
          aria-invalid={assetInvalid}
          aria-describedby={assetInvalid ? assetErrId : undefined}
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2.5 text-[16px] text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent-blue)]"
          placeholder={t("designPartners.apply.assetPlaceholder")}
          maxLength={280}
        />
        <p className="text-xs text-white/40 mt-1">
          {primaryAsset.length}/280
        </p>
        {assetInvalid && (
          <p id={assetErrId} className="text-xs text-red-300 mt-1">
            {t("designPartners.apply.assetError")}
          </p>
        )}
      </div>

      {/* Honeypot (off-screen, not tab-reachable) */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            name="website"
            defaultValue=""
          />
        </label>
      </div>

      <div>
        <label className="flex items-start gap-2.5 text-sm text-white/70 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={consentInvalid}
            aria-describedby={consentInvalid ? consentErrId : undefined}
            className="mt-1 accent-[var(--accent-blue)]"
          />
          <span>{t("designPartners.apply.consent")}</span>
        </label>
        {consentInvalid && (
          <p id={consentErrId} className="text-xs text-red-300 mt-1">
            {t("designPartners.apply.consentError")}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center w-full sm:w-auto rounded-full px-8 py-3 text-base font-medium text-white transition-opacity disabled:opacity-60"
        style={{
          background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
        }}
      >
        {submitting
          ? t("designPartners.apply.submitting")
          : t("designPartners.apply.submit")}
      </button>
    </form>
  );
}
