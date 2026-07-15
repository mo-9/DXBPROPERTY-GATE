"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { RegisterInterestButton } from "./lead/RegisterInterestButton";

/**
 * Sticky header (§7.1.1): transparent over the hero, gains --bg + hairline
 * once scrolled. Wordmark in Bodoni, minimal nav, EN/AR switch.
 */
export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const links = [
    { href: "/developers", label: t("nav.developers") },
    { href: "/areas", label: t("nav.areas") },
    { href: "/about", label: t("nav.about") },
  ] as const;

  const otherLocale = locale === "en" ? "ar" : "en";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-white/75 backdrop-blur-md">
      {/* Always-glass header: stays legible over clear hero photography */}
      <div className="container-gate flex h-16 items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          className="font-display text-lg tracking-wide text-bone md:text-xl"
        >
          DXBPROPERTY <span className="text-gold">GATE</span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-bone ${
                pathname.startsWith(link.href) ? "text-bone" : "text-sand"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={pathname}
            locale={otherLocale}
            aria-label={t("nav.localeSwitchLabel")}
            className="font-mono text-xs tracking-[0.12em] text-sand transition-colors hover:text-gold"
          >
            {t("nav.localeSwitch")}
          </Link>
          <RegisterInterestButton className="border border-gold bg-white/70 px-5 py-2 text-sm text-gold backdrop-blur-sm transition-colors hover:border-gold-bright hover:text-gold-bright">
            {t("common.registerInterest")}
          </RegisterInterestButton>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <Link
            href={pathname}
            locale={otherLocale}
            aria-label={t("nav.localeSwitchLabel")}
            className="font-mono text-xs tracking-[0.12em] text-sand"
          >
            {t("nav.localeSwitch")}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            className="p-2 text-bone"
          >
            {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-line bg-bg px-6 py-6 md:hidden"
          aria-label="Primary mobile"
        >
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block font-display text-2xl text-bone"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <RegisterInterestButton className="w-full border border-gold px-5 py-3 text-gold">
                {t("common.registerInterest")}
              </RegisterInterestButton>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
