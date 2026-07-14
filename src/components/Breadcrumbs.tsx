import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, type Crumb } from "@/lib/jsonld";
import { JsonLd } from "./JsonLd";

/** Visible breadcrumb trail + BreadcrumbList JSON-LD (§10). */
export async function Breadcrumbs({
  crumbs,
  locale,
}: {
  crumbs: Crumb[];
  locale: string;
}) {
  const t = await getTranslations("breadcrumb");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs, locale)} />
      <nav aria-label={t("label")} className="font-mono text-xs text-mute">
        <ol className="flex flex-wrap items-center gap-2">
          {crumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {crumb.path ? (
                <Link
                  href={crumb.path}
                  className="transition-colors hover:text-gold"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-sand">
                  {crumb.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
