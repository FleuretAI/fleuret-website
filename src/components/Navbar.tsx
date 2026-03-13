import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import logoSymbol from "@/assets/logo-symbol.svg";
import logoWordmark from "@/assets/logo-wordmark.svg";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { path: "/#home", label: t("nav.home") },
    { path: "/#why", label: t("nav.problem") },
    { path: "/#platform", label: t("nav.platform") },
    { path: "/#pricing", label: t("nav.pricing") },
  ];

  const companyItems = [
    { path: "/about", label: t("nav.about") },
    { path: "/careers", label: t("nav.careers") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "py-3 bg-[#0f101c]/80 backdrop-blur-xl border-b border-white/5"
          : "py-5 bg-transparent"
      )}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="Fleuret AI - Accueil"
          >
            <img
              src={logoSymbol}
              alt=""
              className={cn(
                "w-auto object-contain transition-all duration-300 brightness-0 invert",
                scrolled ? "h-8" : "h-10"
              )}
              width="34" height="59"
            />
            <img
              src={logoWordmark}
              alt="Fleuret"
              className={cn(
                "w-auto object-contain transition-all duration-300 brightness-0 invert",
                scrolled ? "h-8" : "h-10"
              )}
              width="49" height="12"
            />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-1 rounded-full px-1.5 py-1 border border-white/10 bg-white/5 backdrop-blur-sm"
            aria-label="Navigation principale"
          >
            {navItems.map((item) => (
              <HashLink
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-white/50 hover:text-white px-4 py-1.5 rounded-full transition-colors hover:bg-white/5"
                smooth
              >
                {item.label}
              </HashLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {companyItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-white/40 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <a href="https://calendar.app.google/BCrw74tMZk8NoMU18" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="text-sm font-medium px-5 py-2.5 rounded-full text-white transition-all hover:shadow-[0_0_20px_rgba(79,143,255,0.3)]"
                style={{
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
                }}
              >
                {t("nav.cta")}
              </motion.button>
            </a>
          </div>

          <button
            className="lg:hidden p-2 relative w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <motion.span animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }} className="block w-full h-0.5 rounded-full bg-white origin-center" />
              <motion.span animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }} className="block w-full h-0.5 rounded-full bg-white" />
              <motion.span animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }} className="block w-full h-0.5 rounded-full bg-white origin-center" />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-[#0f101c] border-b border-white/5"
            >
              <div className="flex flex-col gap-1 pt-6 pb-4">
                {navItems.map((item) => (
                  <HashLink
                    key={item.path}
                    to={item.path}
                    smooth
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-white/50 hover:text-white px-4 py-2.5 rounded-lg transition-colors hover:bg-white/5"
                  >
                    {item.label}
                  </HashLink>
                ))}
                {/* Company section */}
                <div className="px-4 pt-3 mt-2 border-t border-white/10">
                  <p className="text-xs text-white/25 uppercase tracking-wider mb-2">{t("nav.company")}</p>
                  {companyItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-white/50 hover:text-white py-2 rounded-lg transition-colors hover:bg-white/5"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3 px-4 pt-4 mt-2 border-t border-white/10">
                  <a href="https://calendar.app.google/BCrw74tMZk8NoMU18" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>
                    <button
                      className="w-full text-sm font-medium px-5 py-2.5 rounded-full text-white"
                      style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))" }}
                    >
                      {t("nav.cta")}
                    </button>
                  </a>
                  <div className="flex items-center justify-center pt-1">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
