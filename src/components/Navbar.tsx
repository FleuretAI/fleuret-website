import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { cn } from "@/lib/utils";
import logoSymbol from "@/assets/logo-symbol.svg";
import logoWordmark from "@/assets/logo-wordmark.svg";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { DEMO_ROUTE } from "@/lib/routes";

const Navbar = () => {
  const { t, localize } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setMobileOpen(false);

  const homePath = localize("/");
  const navItems = [
    { path: `${homePath}#platform`, label: t("nav.platform") },
    { path: `${homePath}#pricing`,  label: t("nav.pricing") },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3 bg-[rgba(15,16,28,0.8)] backdrop-blur-xl border-b border-white/5"
            : "py-5 bg-transparent"
        )}
        style={{ top: "var(--announce-h, 0px)" }}
        role="banner"
        id="nav"
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to={homePath}
            onClick={close}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity flex-shrink-0"
            aria-label="Fleuret AI - Home"
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

          {/* Desktop pill nav */}
          <nav
            className="hidden lg:flex items-center gap-1 rounded-full px-1.5 py-1.5 border border-white/10 bg-white/5 backdrop-blur-sm"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <HashLink
                key={item.path}
                to={item.path}
                smooth
                className="text-sm font-medium text-white/50 hover:text-white px-4 py-1.5 rounded-full transition-colors hover:bg-white/5"
              >
                {item.label}
              </HashLink>
            ))}

            {/* Resources */}
            <Link
              to={localize("/resources")}
              onClick={close}
              className="text-sm font-medium text-white/50 hover:text-white px-4 py-1.5 rounded-full transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-blue)]"
            >
              {t("nav.resources")}
            </Link>

            {/* Company dropdown */}
            <div
              className="relative inline-flex items-center group"
              tabIndex={0}
            >
              <button
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 hover:text-white px-4 py-1.5 rounded-full transition-colors group-hover:text-white group-hover:bg-white/5 group-focus-within:text-white group-focus-within:bg-white/5"
                aria-haspopup="true"
              >
                {t("nav.company")}
                <svg
                  width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
                  className="transition-transform duration-200 opacity-70 group-hover:rotate-180 group-focus-within:rotate-180"
                >
                  <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown menu */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[9rem] p-1.5 rounded-xl bg-[rgba(16,18,30,0.95)] backdrop-blur-xl border border-white/8 shadow-[0_16px_40px_rgba(0,0,0,0.4)] flex flex-col gap-0.5 opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto translate-y-[-4px] group-hover:translate-y-0 group-focus-within:translate-y-0"
                role="menu"
                style={{ zIndex: 60 }}
              >
                {/* Invisible bridge to prevent gap-close */}
                <div className="absolute left-0 right-0 top-[-0.6rem] h-3" />
                <Link
                  to={localize("/about")}
                  role="menuitem"
                  className="block px-3 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/6 transition-colors whitespace-nowrap"
                >
                  {t("nav.aboutUs")}
                </Link>
                <Link
                  to={localize("/careers")}
                  role="menuitem"
                  className="block px-3 py-2 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/6 transition-colors whitespace-nowrap"
                >
                  {t("nav.careers")}
                </Link>
              </div>
            </div>
          </nav>

          {/* Desktop right zone */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link to={localize(DEMO_ROUTE)} className="btn-cta btn-cta--sm">
              {t("nav.cta")}
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobileNav"
          >
            <div className="w-5 flex flex-col gap-[5px]">
              <span
                className="block h-0.5 rounded-full bg-white origin-center transition-transform duration-250"
                style={{ transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }}
              />
              <span
                className="block h-0.5 rounded-full bg-white transition-opacity duration-200"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block h-0.5 rounded-full bg-white origin-center transition-transform duration-250"
                style={{ transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        ref={backdropRef}
        onClick={close}
        className="lg:hidden fixed inset-0 bg-black/40 transition-opacity duration-250"
        style={{ zIndex: 35, opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "auto" : "none" }}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile drawer */}
      <nav
        id="mobileNav"
        className="lg:hidden fixed top-0 right-0 bottom-0 flex flex-col gap-1 backdrop-blur-2xl border-l border-white/8"
        style={{
          width: "min(20rem, 85vw)",
          background: "rgba(12,13,23,0.96)",
          padding: "5rem 1.5rem 2rem",
          transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          zIndex: 40,
        }}
        aria-hidden={!mobileOpen}
        aria-label="Mobile navigation"
      >
        <HashLink to={`${homePath}#platform`} smooth onClick={close} className="px-4 py-3.5 rounded-lg text-base text-white/70 hover:text-white hover:bg-white/4 transition-colors">{t("nav.platform")}</HashLink>
        <HashLink to={`${homePath}#pricing`}  smooth onClick={close} className="px-4 py-3.5 rounded-lg text-base text-white/70 hover:text-white hover:bg-white/4 transition-colors">{t("nav.pricing")}</HashLink>
        <Link to={localize("/resources")} onClick={close} className="px-4 py-3.5 rounded-lg text-base text-white/70 hover:text-white hover:bg-white/4 transition-colors">{t("nav.resources")}</Link>

        <p className="text-[0.7rem] font-medium text-white/35 uppercase tracking-[0.15em] px-4 pt-4 pb-1">
          {t("nav.company")}
        </p>
        <Link to={localize("/about")}   onClick={close} className="pl-8 pr-4 py-2.5 rounded-lg text-[0.9rem] text-white/55 hover:text-white hover:bg-white/4 transition-colors">{t("nav.aboutUs")}</Link>
        <Link to={localize("/careers")} onClick={close} className="pl-8 pr-4 py-2.5 rounded-lg text-[0.9rem] text-white/55 hover:text-white hover:bg-white/4 transition-colors">{t("nav.careers")}</Link>

        <Link
          to={localize(DEMO_ROUTE)}
          onClick={close}
          className="btn-cta btn-cta--block mt-4"
        >
          {t("nav.cta")}
        </Link>

        <div className="mt-4 flex justify-center">
          <LanguageSwitcher />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
