import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatCompact } from "@/lib/format";
import { getDeveloper } from "@/lib/data";
import type { Project } from "@/lib/types";

/** Featured/related project card (§7.1.6). Verified fields only. */
export async function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const t = await getTranslations();
  const locale = await getLocale();
  const developer = getDeveloper(project.developerSlug);

  return (
    <article className="group border border-line bg-surface transition-colors hover:border-line-strong">
      <Link href={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={project.heroImage}
            alt={`${project.name}, ${project.area}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <span className="absolute start-4 top-4 border border-white/50 bg-white/70 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-bone uppercase backdrop-blur-sm">
            {t(`project.statusValues.${project.status}`)}
          </span>
        </div>
        <div className="p-6">
          <h3 className="font-display text-2xl text-bone transition-colors group-hover:text-gold-bright">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-sand">
            {developer ? `${developer.name} · ` : ""}
            {project.area}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="truncate text-xs text-mute">
              {project.unitTypes
                .slice(0, 4)
                .map((u) => t(`unitTypes.${u}`))
                .join(" · ")}
            </p>
            {project.priceFromAED && (
              <p className="font-mono text-sm text-gold">
                {t("project.fromAED", {
                  price: formatCompact(project.priceFromAED, locale),
                })}
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
