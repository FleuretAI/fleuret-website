import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/seo/SEO";

const NotFound = () => {
  const location = useLocation();
  const { t, localize } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-site-gradient">
      <SEO pageKey="notFound" noindex />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">{t('notfound.title')}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t('notfound.subtitle')}</p>
        <a href={localize("/")} className="text-primary underline hover:opacity-90">
          {t('notfound.home')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
