import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
      className="text-sm font-medium text-white/40 hover:text-white px-2 py-1 rounded transition-colors"
    >
      {language === "fr" ? "FR" : "EN"}
    </button>
  );
};

export default LanguageSwitcher;
