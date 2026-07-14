import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { LeadContext } from "@/components/lead/LeadContext";
import { RegisterInterestButton } from "@/components/lead/RegisterInterestButton";
import { Link } from "@/i18n/navigation";
import { getDeveloper, getProject, projects, projectsByDeveloper, projectsInArea } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import { projectJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug }))
  );
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const developer = getDeveloper(project.developerSlug);
  const t = await getTranslations({ locale, namespace: "meta.project" });
  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: t("title", {
      project: project.name,
      developer: developer?.name ?? "",
      area: project.area,
    }),
    description: t("description", {
      project: project.name,
      developer: developer?.name ?? "",
      area: project.area,
    }),
  });
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  setRequestLocale(locale);
  const t = await getTranslations();
  const developer = getDeveloper(project.developerSlug);

  const moreByDeveloper = projectsByDeveloper(project.developerSlug, project.slug).slice(0, 3);
  const moreInArea = projectsInArea(project.areaSlug, project.slug).slice(0, 3);

  // Verified-only key facts (§7.3/§12): absent values are simply not rendered.
  const facts: { label: string; value: string }[] = [
    { label: t("project.status"), value: t(`project.statusValues.${project.status}`) },
  ];
  if (project.handover) facts.push({ label: t("project.handover"), value: project.handover });
  if (project.paymentPlan) facts.push({ label: t("project.paymentPlan"), value: project.paymentPlan });
  if (project.sizeFromSqft)
    facts.push({
      label: t("project.sizeFrom"),
      value: `${formatNumber(project.sizeFromSqft, locale)} ${t("project.sqft")}`,
    });

  return (
    <>
      <JsonLd data={projectJsonLd(project, developer, locale)} />
      <LeadContext developer={project.developerSlug} project={project.slug} />

      {/* Above the fold (§7.3) */}
      <section className="hero-glow">
        <div className="container-gate pt-28 md:pt-36">
          <Breadcrumbs
            locale={locale}
            crumbs={[
              { name: t("breadcrumb.home"), path: "/" },
              ...(developer
                ? [{ name: developer.name, path: `/developers/${developer.slug}` }]
                : []),
              { name: project.name },
            ]}
          />
          <div className="grid gap-10 pt-12 pb-16 lg:grid-cols-[1.1fr_1fr] md:pb-20">
            <div>
              <p className="eyebrow">
                {t(`project.statusValues.${project.status}`)}
              </p>
              <h1 className="title-hero mt-4 text-balance">{project.name}</h1>
              <p className="mt-5 text-lg text-sand">
                {developer && (
                  <>
                    <Link
                      href={`/developers/${developer.slug}`}
                      className="text-gold transition-colors hover:text-gold-bright"
                    >
                      {developer.name}
                    </Link>
                    {" · "}
                  </>
                )}
                <Link
                  href={`/areas/${project.areaSlug}`}
                  className="transition-colors hover:text-bone"
                >
                  {project.area}
                </Link>
              </p>
              {project.priceFromAED && (
                <p className="mt-7 font-mono text-2xl text-bone">
                  {t("project.fromAED", {
                    price: formatNumber(project.priceFromAED, locale),
                  })}
                </p>
              )}
              <p className="mt-4 max-w-lg text-sm text-mute">
                {project.unitTypes.map((u) => t(`unitTypes.${u}`)).join(" · ")}
              </p>
              <div className="mt-9">
                <RegisterInterestButton className="bg-gold px-7 py-3.5 font-medium text-bg transition-colors hover:bg-gold-bright">
                  {t("common.registerInterest")}
                </RegisterInterestButton>
              </div>
            </div>
            <div className="relative aspect-[16/11] overflow-hidden border border-line">
              <Image
                src={project.heroImage}
                alt={`${project.name}, ${project.area}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Description + key facts */}
      <section className="border-t border-line">
        <div className="container-gate grid gap-12 py-16 md:py-24 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="max-w-xl leading-relaxed text-sand">{project.description}</p>
            {project.amenities && project.amenities.length > 0 && (
              <div className="mt-10">
                <h2 className="eyebrow !text-mute text-[11px]">
                  {t("project.amenities")}
                </h2>
                <ul className="mt-4 flex max-w-xl flex-wrap gap-2">
                  {project.amenities.map((amenity) => (
                    <li
                      key={amenity}
                      className="border border-line px-3 py-1.5 text-sm text-sand"
                    >
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border border-line bg-surface p-7">
              <h2 className="eyebrow !text-mute text-[11px]">{t("project.keyFacts")}</h2>
              <dl className="mt-5 divide-y divide-line">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="text-sm text-mute">{fact.label}</dt>
                    <dd className="font-mono text-sm text-bone">{fact.value}</dd>
                  </div>
                ))}
                {developer && (
                  <div className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="text-sm text-mute">{t("project.developer")}</dt>
                    <dd className="text-sm">
                      <Link
                        href={`/developers/${developer.slug}`}
                        className="text-gold transition-colors hover:text-gold-bright"
                      >
                        {developer.name}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
              {project.reraPermit && (
                <p className="mt-5 border-t border-line pt-4 font-mono text-xs text-mute">
                  {t("project.permit")}: {project.reraPermit}
                </p>
              )}
              {project.coordinates && (
                <a
                  href={`https://www.google.com/maps?q=${project.coordinates.lat},${project.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm text-gold transition-colors hover:text-gold-bright"
                >
                  <MapPin size={15} aria-hidden />
                  {t("project.openInMaps")}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gallery (verified-supplied imagery only) */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="border-t border-line py-16 md:py-24">
          <div className="container-gate">
            <h2 className="eyebrow !text-mute text-[11px]">{t("project.gallery")}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((src, i) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden border border-line">
                  <Image
                    src={src}
                    alt={`${project.name} — ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Internal linking mesh (§10) */}
      {(moreByDeveloper.length > 0 || moreInArea.length > 0) && (
        <section className="border-t border-line bg-surface/40 section-pad">
          <div className="container-gate space-y-16">
            {moreByDeveloper.length > 0 && developer && (
              <div>
                <h2 className="font-display text-2xl text-bone md:text-3xl">
                  {t("project.moreByDeveloper", { developer: developer.name })}
                </h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {moreByDeveloper.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              </div>
            )}
            {moreInArea.length > 0 && (
              <div>
                <h2 className="font-display text-2xl text-bone md:text-3xl">
                  {t("project.moreInArea", { area: project.area })}
                </h2>
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {moreInArea.map((p) => (
                    <ProjectCard key={p.slug} project={p} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <CTABand />

      {/* Sticky mobile CTA (§7.3/§11) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 p-3 backdrop-blur-sm md:hidden">
        <RegisterInterestButton className="w-full bg-gold px-6 py-3.5 font-medium text-bg">
          {t("common.registerInterest")}
        </RegisterInterestButton>
      </div>
    </>
  );
}
