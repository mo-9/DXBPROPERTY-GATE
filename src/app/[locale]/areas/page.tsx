import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { SectionHeading } from "@/components/SectionHeading";
import { Link } from "@/i18n/navigation";
import { areas } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.areasIndex" });
  return buildMetadata({
    locale,
    path: "/areas",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AreasIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <div className="container-gate pt-28 md:pt-36">
        <Breadcrumbs
          locale={locale}
          crumbs={[
            { name: t("breadcrumb.home"), path: "/" },
            { name: t("breadcrumb.areas") },
          ]}
        />
        <div className="mt-10 pb-8">
          <SectionHeading
            as="h1"
            eyebrow={t("areas.eyebrow")}
            title={t("areas.indexTitle")}
            intro={t("areas.indexIntro")}
          />
        </div>
      </div>
      <div className="container-gate pb-24 md:pb-32">
        <ul className="border-t border-line">
          {areas.map((area) => (
            <li key={area.slug} className="border-b border-line">
              <Link
                href={`/areas/${area.slug}`}
                className="group flex items-baseline gap-6 py-6 transition-colors hover:bg-surface md:px-4"
              >
                <span className="font-display text-2xl text-bone transition-colors group-hover:text-gold-bright md:text-3xl">
                  {area.name}
                </span>
                <span className="font-mono text-xs text-mute">
                  {t("areas.projectCount", { count: area.projects.length })}
                </span>
                <ArrowUpRight
                  size={18}
                  aria-hidden
                  className="ms-auto self-center text-mute transition-colors group-hover:text-gold rtl:-scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <CTABand />
    </>
  );
}
