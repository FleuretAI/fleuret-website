import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      className="text-sm font-medium text-white/60 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 transition-all"
      aria-label={language === "fr" ? "Switch to English" : "Passer en français"}
    >
      {language === "fr" ? "EN" : "FR"}
    </button>
  );
};

export default LanguageSwitcher;
