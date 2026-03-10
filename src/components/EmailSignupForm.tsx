import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const emailSchema = z.string().email().max(255);

const EmailSignupForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({ title: t("waitlist.error.invalid"), variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("add-to-brevo", {
        body: { email: validation.data },
      });
      if (error) throw error;
      toast({
        title: t("waitlist.success.title"),
        description: t("waitlist.success.description"),
      });
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      toast({ title: t("waitlist.error.generic"), variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="relative flex items-center rounded-full p-1.5 transition-all duration-300 bg-white/8 border border-white/10 focus-within:border-[var(--accent-blue)]/40 focus-within:bg-white/10 focus-within:shadow-[0_0_30px_rgba(79,143,255,0.1)]">
        <input
          type="email"
          placeholder={t("waitlist.placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-transparent border-0 outline-none px-4 text-sm min-w-0 font-sans text-white placeholder:text-white/30"
          disabled={isSubmitting}
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
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            t("hero.cta.waitlist")
          )}
        </motion.button>
      </div>
      <p className="text-xs mt-3 text-center text-white/25">
        {t("waitlist.subtext")}
      </p>
    </form>
  );
};

export default EmailSignupForm;
