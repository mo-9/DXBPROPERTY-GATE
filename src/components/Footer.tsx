import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-gate grid gap-12 py-16 md:grid-cols-3 md:py-20">
        <div className="md:col-span-1">
          <p className="font-display text-xl text-bone">
            DXBPROPERTY <span className="text-gold">GATE</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand">
            {t("footer.mission")}
          </p>
        </div>

        <nav aria-label={t("footer.navTitle")}>
          <p className="eyebrow mb-5 !text-mute text-[11px]">{t("footer.navTitle")}</p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/developers" className="text-sand transition-colors hover:text-bone">
                {t("nav.developers")}
              </Link>
            </li>
            <li>
              <Link href="/areas" className="text-sand transition-colors hover:text-bone">
                {t("nav.areas")}
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sand transition-colors hover:text-bone">
                {t("nav.about")}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-5 !text-mute text-[11px]">{t("footer.legalTitle")}</p>
          {/* Compliance line — required on every page (§7.1.8/§12) */}
          <p className="text-sm leading-relaxed text-mute">{t("footer.compliance")}</p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-gate flex flex-wrap items-center justify-between gap-3 py-6">
          <p className="font-mono text-xs text-mute">{t("footer.rights", { year })}</p>
          <p className="font-mono text-xs tracking-[0.14em] text-mute uppercase">
            {t("common.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
