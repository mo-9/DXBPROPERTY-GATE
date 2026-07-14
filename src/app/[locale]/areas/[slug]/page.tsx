import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { areas, getArea } from "@/lib/data";
import { faqJsonLd, type FaqEntry } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { padRank } from "@/lib/format";
import { routing } from "@/i18n/routing";

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    areas.map((a) => ({ locale, slug: a.slug }))
  );
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const area = getArea(slug);
  if (!area) return {};
  const t = await getTranslations({ locale, namespace: "meta.area" });
  return buildMetadata({
    locale,
    path: `/areas/${slug}`,
    title: t("title", { area: area.name }),
    description: t("description", { area: area.name }),
  });
}

export default async function AreaPage({ params }: Props) {
  const { locale, slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  // FAQ content is data-grounded: names, unit types and statuses come from
  // the dataset itself — long-tail SEO without fabricated claims (§7.4/§12).
  const developerNames = area.developers.map((d) => d.name).join(", ");
  const unitTypes = [...new Set(area.projects.flatMap((p) => p.unitTypes))]
    .map((u) => t(`unitTypes.${u}`))
    .join(", ");
  const offPlanCount = area.projects.filter((p) => p.status === "off-plan").length;

  const faq: FaqEntry[] = [
    {
      question: t("areas.faq.developersQ", { area: area.name }),
      answer: t("areas.faq.developersA", { area: area.name, developers: developerNames }),
    },
    {
      question: t("areas.faq.unitsQ", { area: area.name }),
      answer: t("areas.faq.unitsA", { area: area.name, unitTypes }),
    },
    {
      question: t("areas.faq.offPlanQ", { area: area.name }),
      answer:
        offPlanCount > 0
          ? t("areas.faq.offPlanAYes", { area: area.name, count: offPlanCount })
          : t("areas.faq.offPlanANo", { area: area.name }),
    },
    {
      question: t("areas.faq.verifyQ", { area: area.name }),
      answer: t("areas.faq.verifyA"),
    },
  ];

  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />

      <section className="hero-glow">
        <div className="container-gate pt-28 md:pt-36">
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: t("breadcrumb.home"), path: "/" },
              { name: t("breadcrumb.areas"), path: "/areas" },
              { name: area.name },
            ]}
          />
          <div className="pt-12 pb-16 md:pb-20">
            <p className="eyebrow">{t("areas.eyebrow")}</p>
            <h1 className="title-hero mt-4 text-balance">{area.name}</h1>
            <p className="mt-6 max-w-xl text-sand">
              {t("areas.faq.developersA", {
                area: area.name,
                developers: developerNames,
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line section-pad">
        <div className="container-gate">
          <Reveal>
            <h2 className="title-section text-balance">
              {t("areas.projectsIn", { area: area.name })}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {area.projects.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.05}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface/40 py-16 md:py-24">
        <div className="container-gate">
          <h2 className="font-display text-2xl text-bone md:text-3xl">
            {t("areas.developersIn", { area: area.name })}
          </h2>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {area.developers.map((dev) => (
              <li key={dev.slug}>
                <Link
                  href={`/developers/${dev.slug}`}
                  className="group flex items-baseline gap-6 py-5 transition-colors hover:bg-surface md:px-3"
                >
                  <span className="font-mono text-sm text-gold">{padRank(dev.rank)}</span>
                  <span className="font-display text-xl text-bone transition-colors group-hover:text-gold-bright md:text-2xl">
                    {dev.name}
                  </span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="ms-auto self-center text-mute transition-colors group-hover:text-gold rtl:-scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ — mirrors the FAQPage JSON-LD above (§7.4) */}
      <section className="border-t border-line section-pad">
        <div className="container-gate">
          <Reveal>
            <h2 className="title-section">{t("areas.faqTitle")}</h2>
          </Reveal>
          <dl className="mt-12 max-w-3xl divide-y divide-line border-y border-line">
            {faq.map((entry) => (
              <div key={entry.question} className="py-7">
                <dt className="font-display text-xl text-bone">{entry.question}</dt>
                <dd className="mt-3 leading-relaxed text-sand">{entry.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CTABand />
    </>
  );
}
