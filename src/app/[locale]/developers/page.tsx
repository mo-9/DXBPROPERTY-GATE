import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { DeveloperIndex } from "@/components/DeveloperIndex";
import { SectionHeading } from "@/components/SectionHeading";
import { developers } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.developers" });
  return buildMetadata({
    locale,
    path: "/developers",
    title: t("title"),
    description: t("description"),
  });
}

export default async function DevelopersPage({ params }: Props) {
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
            { name: t("breadcrumb.developers") },
          ]}
        />
        <div className="mt-10 pb-8">
          <SectionHeading
            as="h1"
            eyebrow={t("index.eyebrow")}
            title={t("developersPage.title")}
            intro={t("developersPage.intro")}
          />
        </div>
      </div>
      <div className="container-gate pb-24 md:pb-32">
        <Suspense>
          <DeveloperIndex developers={developers} withSearch />
        </Suspense>
      </div>
      <CTABand />
    </>
  );
}
