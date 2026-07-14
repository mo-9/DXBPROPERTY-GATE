import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <section className="hero-glow flex min-h-svh items-center">
      <div className="container-gate py-32 text-center">
        <p className="eyebrow">404</p>
        <h1 className="title-section mt-4">{t("notFoundTitle")}</h1>
        <p className="mx-auto mt-5 max-w-md text-sand">{t("notFoundBody")}</p>
        <Link
          href="/"
          className="mt-9 inline-block border border-gold px-7 py-3.5 text-gold transition-colors hover:border-gold-bright hover:text-gold-bright"
        >
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}
