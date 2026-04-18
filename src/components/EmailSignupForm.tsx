import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, opts: {
        sitekey: string;
        callback?: (token: string) => void;
        "error-callback"?: () => void;
        "expired-callback"?: () => void;
        size?: "normal" | "flexible" | "compact" | "invisible";
        theme?: "light" | "dark" | "auto";
      }) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

const emailSchema = z.string().email().max(255);
const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const EmailSignupForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  useEffect(() => {
    if (!siteKey) {
      if (import.meta.env.DEV) {
        console.warn(
          "VITE_TURNSTILE_SITE_KEY is not set. The form will submit without a Turnstile token " +
          "and the edge function will reject it with 403. Set the env var in .env or skip captcha in dev."
        );
      }
      return;
    }
    if (!widgetRef.current) return;

    let cancelled = false;
    let widgetId: string | null = null;
    let pollTimer: number | null = null;

    const render = () => {
      if (cancelled || !widgetRef.current || !window.turnstile) return;
      widgetId = window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        theme: "dark",
        size: "flexible",
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(null),
        "error-callback": () => setTurnstileToken(null),
      });
      widgetIdRef.current = widgetId;
    };

    if (window.turnstile) {
      render();
    } else if (!document.getElementById(TURNSTILE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = TURNSTILE_SRC;
      script.async = true;
      script.defer = true;
      script.onload = render;
      document.head.appendChild(script);
    } else {
      pollTimer = window.setInterval(() => {
        if (window.turnstile) {
          if (pollTimer !== null) {
            window.clearInterval(pollTimer);
            pollTimer = null;
          }
          render();
        }
      }, 100);
    }

    return () => {
      cancelled = true;
      if (pollTimer !== null) window.clearInterval(pollTimer);
      if (widgetId !== null && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
      widgetIdRef.current = null;
    };
  }, [siteKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      setErrorKey("waitlist.error.invalid");
      toast({ title: t("waitlist.error.invalid"), variant: "destructive" });
      return;
    }
    if (siteKey && !turnstileToken) {
      setErrorKey("waitlist.error.captcha");
      toast({ title: t("waitlist.error.captcha"), variant: "destructive" });
      return;
    }
    setErrorKey(null);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("add-to-brevo", {
        body: { email: validation.data, turnstileToken: turnstileToken ?? "" },
      });
      if (error) throw error;
      toast({
        title: t("waitlist.success.title"),
        description: t("waitlist.success.description"),
      });
      setEmail("");
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
        setTurnstileToken(null);
      }
    } catch (_error) {
      setErrorKey("waitlist.error.generic");
      toast({ title: t("waitlist.error.generic"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg" noValidate>
      <label htmlFor={inputId} className="sr-only">
        {t("waitlist.placeholder")}
      </label>
      <div className="relative flex items-center rounded-full p-1.5 transition-all duration-300 bg-white/8 border border-white/10 focus-within:border-[var(--accent-blue)]/40 focus-within:bg-white/10 focus-within:shadow-[0_0_30px_rgba(79,143,255,0.1)]">
        <input
          id={inputId}
          type="email"
          placeholder={t("waitlist.placeholder")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errorKey) setErrorKey(null);
          }}
          className="flex-1 bg-transparent border-0 outline-none px-4 text-sm min-w-0 font-sans text-white placeholder:text-white/30"
          disabled={isSubmitting}
          autoComplete="email"
          aria-invalid={errorKey ? "true" : "false"}
          aria-describedby={errorKey ? errorId : undefined}
          required
        />
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 transition-all disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
            color: "white",
          }}
        >
          {isSubmitting ? (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" role="img" aria-label={t("waitlist.submitting")}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            t("hero.cta.waitlist")
          )}
        </motion.button>
      </div>
      {errorKey && (
        <p id={errorId} role="alert" className="text-xs mt-2 text-center text-red-400">
          {t(errorKey)}
        </p>
      )}
      <div ref={widgetRef} className="mt-3 flex justify-center" aria-hidden={!siteKey} />
      <p className="text-xs mt-3 text-center text-white/60">
        {t("waitlist.subtext")}
      </p>
    </form>
  );
};

export default EmailSignupForm;
