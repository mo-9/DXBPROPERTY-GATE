import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { Reveal } from "@/components/Reveal";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return buildMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <section className="hero-glow">
        <div className="container-gate pt-28 md:pt-36">
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: t("breadcrumb.home"), path: "/" },
              { name: t("nav.about") },
            ]}
          />
          <div className="pt-12 pb-16 md:pb-24">
            <p className="eyebrow">{t("common.tagline")}</p>
            <h1 className="title-hero mt-4 max-w-4xl text-balance">
              {t("about.title")}
            </h1>
            <p className="mt-7 max-w-xl text-lg text-sand">{t("about.intro")}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line section-pad">
        <div className="container-gate grid gap-16 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="title-section">{t("about.how.title")}</h2>
              <div className="mt-6 max-w-lg space-y-5 leading-relaxed text-sand">
                <p>{t("about.how.body1")}</p>
                <p>{t("about.how.body2")}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h2 className="title-section">{t("about.trust.title")}</h2>
              <div className="mt-6 max-w-lg space-y-5 leading-relaxed text-sand">
                <p>{t("about.trust.body1")}</p>
                <p>{t("about.trust.body2")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABand />
    </>
  );
}
