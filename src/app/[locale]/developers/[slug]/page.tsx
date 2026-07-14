import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { LeadContext } from "@/components/lead/LeadContext";
import { Link } from "@/i18n/navigation";
import { developers, getDeveloper, relatedDevelopers } from "@/lib/data";
import { formatAED, formatNumber, padRank } from "@/lib/format";
import { developerJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    developers.map((d) => ({ locale, slug: d.slug }))
  );
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const developer = getDeveloper(slug);
  if (!developer) return {};
  const t = await getTranslations({ locale, namespace: "meta.developer" });
  return buildMetadata({
    locale,
    path: `/developers/${slug}`,
    title: t("title", { developer: developer.name }),
    description: t("description", { developer: developer.name }),
  });
}

export default async function DeveloperPage({ params }: Props) {
  const { locale, slug } = await params;
  const developer = getDeveloper(slug);
  if (!developer) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();

  const related = relatedDevelopers(developer);
  const stats: { label: string; value: string }[] = [];
  if (developer.stats?.salesValue2025AED)
    stats.push({
      label: t("developer.statsSales"),
      value: formatAED(developer.stats.salesValue2025AED, locale),
    });
  if (developer.stats?.unitsDelivered)
    stats.push({
      label: t("developer.statsUnits"),
      value: formatNumber(developer.stats.unitsDelivered, locale),
    });
  if (developer.stats?.roiPercent)
    stats.push({
      label: t("developer.statsRoi"),
      value: `${developer.stats.roiPercent}%`,
    });

  return (
    <>
      <JsonLd data={developerJsonLd(developer, locale)} />
      <LeadContext developer={developer.slug} />

      {/* Hero (§7.2) */}
      <section className="hero-glow relative">
        <div className="container-gate pt-28 md:pt-36">
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: t("breadcrumb.home"), path: "/" },
              { name: t("breadcrumb.developers"), path: "/developers" },
              { name: developer.name },
            ]}
          />
          <div className="grid items-end gap-10 pt-12 pb-16 lg:grid-cols-[1.2fr_1fr] md:pb-20">
            <div>
              <p className="font-mono text-sm font-medium text-gold">
                {padRank(developer.rank)}
                <span className="text-mute"> / {padRank(developers.length)}</span>
              </p>
              <h1 className="title-hero mt-4 text-balance">{developer.name}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="border border-line px-3 py-1.5 font-mono text-[11px] tracking-[0.12em] text-sand uppercase">
                  {developer.segment
                    ? t(`segment.${developer.segment}`)
                    : t("segment.tbc")}
                </span>
                {developer.founded && (
                  <span className="font-mono text-sm text-mute">
                    {t("developer.founded")}{" "}
                    <span className="text-sand">{developer.founded}</span>
                  </span>
                )}
                {developer.website && (
                  <a
                    href={developer.website}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex items-center gap-1 font-mono text-sm text-gold transition-colors hover:text-gold-bright"
                  >
                    {t("developer.website")}
                    <ArrowUpRight size={14} aria-hidden className="rtl:-scale-x-100" />
                  </a>
                )}
              </div>
              {developer.headline && (
                <p className="mt-7 max-w-xl text-lg text-sand">{developer.headline}</p>
              )}
            </div>
            <div className="relative aspect-[16/10] overflow-hidden border border-line">
              <Image
                src={developer.heroImage}
                alt={developer.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Editorial description + stats */}
      {(developer.description || stats.length > 0) && (
        <section className="border-t border-line">
          <div className="container-gate grid gap-12 py-16 md:py-24 lg:grid-cols-[1.2fr_1fr]">
            {developer.description ? (
              <Reveal>
                <div className="max-w-xl space-y-5 text-sand">
                  {developer.description.split("\n\n").map((para, i) => (
                    <p key={i} className="leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </Reveal>
            ) : (
              <p className="max-w-xl text-mute">{t("developer.profilePending")}</p>
            )}
            {stats.length > 0 && (
              <Reveal delay={0.1}>
                <dl className="grid gap-8 sm:grid-cols-2">
                  {stats.map((stat) => (
                    <div key={stat.label} className="border-t border-line-strong pt-5">
                      <dd className="font-mono text-3xl font-medium text-bone">
                        {stat.value}
                      </dd>
                      <dt className="eyebrow mt-2 !text-mute text-[11px]">
                        {stat.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Projects (§7.2) */}
      <section className="border-t border-line section-pad">
        <div className="container-gate">
          <Reveal>
            <h2 className="title-section text-balance">
              {t("developer.projectsTitle", { developer: developer.name })}
            </h2>
          </Reveal>
          {developer.projects.length > 0 ? (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {developer.projects.map((project, i) => (
                <Reveal key={project.slug} delay={i * 0.05}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-8 max-w-xl text-mute">{t("developer.noProjects")}</p>
          )}
        </div>
      </section>

      {/* Related developers in the same segment */}
      {related.length > 0 && (
        <section className="border-t border-line bg-surface/40 py-16 md:py-24">
          <div className="container-gate">
            <h2 className="font-display text-2xl text-bone md:text-3xl">
              {t("developer.relatedTitle")}
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {related.map((dev) => (
                <li key={dev.slug}>
                  <Link
                    href={`/developers/${dev.slug}`}
                    className="group flex items-baseline gap-6 py-5 transition-colors hover:bg-surface md:px-3"
                  >
                    <span className="font-mono text-sm text-gold">
                      {padRank(dev.rank)}
                    </span>
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
      )}

      <CTABand />
    </>
  );
}
