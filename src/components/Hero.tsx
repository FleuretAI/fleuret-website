import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email().max(255);

const Hero = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = emailSchema.safeParse(email);
    if (!validation.success) {
      toast({
        title: t('waitlist.error.invalid'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('add-to-brevo', {
        body: { email: validation.data },
      });

      if (error) throw error;

      toast({
        title: t('waitlist.success.title'),
        description: t('waitlist.success.description'),
      });
      setEmail("");
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: t('waitlist.error.generic'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = t('hero.title');
  const [firstPartRaw, secondPartRaw] = title.split(',');
  const firstPart = firstPartRaw?.trim();
  const secondPart = secondPartRaw?.trim();

  return (
    <section id="home" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-8 md:pt-12" itemScope itemType="https://schema.org/WebPageElement">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-5xl mx-auto text-center space-y-6 animate-in fade-in duration-1000">

          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-tight font-urbanist" itemProp="headline">
            <span className="text-gradient glow-effect">
              <span className="whitespace-nowrap">{firstPart}</span>
              {secondPart && (
                <>
                  <br className="hidden md:block" />
                  <span className="block md:inline">{secondPart}</span>
                </>
              )}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" itemProp="description">
            {t('hero.subtitle')}
          </p>

          {/* Email signup form with demo button */}
          <div id="waitlist" className="flex flex-col gap-4 justify-center items-stretch pt-6 max-w-3xl mx-auto scroll-mt-20 px-2">
            {/* Demo button */}
            <Link to="/demo" aria-label="Voir la démonstration de notre POC fonctionnel" className="w-full sm:w-auto sm:self-center">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base sm:text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 h-[48px] sm:h-[52px]"
              >
                {t('hero.cta.demo')}
              </Button>
            </Link>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-secondary/50 rounded-2xl sm:rounded-full border border-border/50 p-1.5 sm:p-1.5 backdrop-blur-sm transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.3)] focus-within:bg-secondary/70 gap-2 sm:gap-0">
                <Input
                  type="email"
                  placeholder={t('waitlist.placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full flex-1 bg-transparent border-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-3 sm:px-4 text-sm sm:text-base min-w-0"
                  disabled={isSubmitting}
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 py-2 h-[40px] sm:h-auto font-medium text-sm sm:text-base whitespace-nowrap shrink-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">{t('hero.cta.waitlist')}</span>
                      <span className="sm:hidden">{t('nav.waitlist')}</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
