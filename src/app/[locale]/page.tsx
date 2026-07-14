import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { CTABand } from "@/components/CTABand";
import { DeveloperIndex } from "@/components/DeveloperIndex";
import { HomeHero } from "@/components/HomeHero";
import { MarketStrip } from "@/components/MarketStrip";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { Ticker } from "@/components/Ticker";
import { developers, featuredProjects } from "@/lib/data";

// Curated strip (§7.1.6): the dataset flags many flagships; the homepage
// shows the first six in index order to stay a strip, not a grid dump.
const homeFeatured = featuredProjects.slice(0, 6);
import { buildMetadata } from "@/lib/seo";

export const revalidate = 86400; // ISR (§3)

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return buildMetadata({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const whyPoints = ["curated", "verified", "direct", "bilingual"] as const;

  return (
    <>
      <HomeHero />

      <Ticker />

      <MarketStrip />

      {/* The Index (§7.1.5) */}
      <section className="section-pad">
        <div className="container-gate">
          <Reveal>
            <SectionHeading
              eyebrow={t("index.eyebrow")}
              title={t("index.title")}
              intro={t("index.intro")}
            />
          </Reveal>
          <div className="mt-12">
            <Suspense>
              <DeveloperIndex developers={developers} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Featured projects (§7.1.6) */}
      {homeFeatured.length > 0 && (
        <section className="border-t border-line bg-surface/40 section-pad">
          <div className="container-gate">
            <Reveal>
              <SectionHeading
                eyebrow={t("featured.eyebrow")}
                title={t("featured.title")}
                intro={t("featured.intro")}
              />
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {homeFeatured.map((project, i) => (
                <Reveal key={project.slug} delay={i * 0.06}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why DXBPROPERTY GATE (§7.1.7) */}
      <section className="border-t border-line section-pad">
        <div className="container-gate">
          <Reveal>
            <SectionHeading
              eyebrow={t("why.eyebrow")}
              title={t("why.title")}
            />
          </Reveal>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {whyPoints.map((key, i) => (
              <Reveal key={key} delay={i * 0.07}>
                <div className="border-t border-line-strong pt-6">
                  <p className="font-mono text-sm font-medium text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-xl text-bone">
                    {t(`why.points.${key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand">
                    {t(`why.points.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTABand />
    </>
  );
}
