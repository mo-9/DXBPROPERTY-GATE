"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import { formatAED, formatNumber, padRank } from "@/lib/format";
import type { Developer, Segment } from "@/lib/types";

type Filter = "all" | Segment;

const FILTERS: Filter[] = ["all", "master", "luxury", "value", "boutique"];

/**
 * The Index (§7.1.5) — a type-led editorial index of the 26 developers.
 * Filtering preserves each developer's true rank number. The optional
 * search box also powers the WebSite SearchAction target (/developers?q=).
 */
export function DeveloperIndex({
  developers,
  withSearch = false,
}: {
  developers: Developer[];
  withSearch?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState(
    withSearch ? (searchParams.get("q") ?? "") : ""
  );

  const visible = useMemo(() => {
    let list = developers;
    if (filter !== "all") list = list.filter((d) => d.segment === filter);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    return list;
  }, [developers, filter, query]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label={t("index.filterLabel")}
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`border px-4 py-2 font-mono text-xs tracking-[0.1em] uppercase transition-colors ${
                filter === f
                  ? "border-gold text-gold"
                  : "border-line text-mute hover:border-line-strong hover:text-sand"
              }`}
            >
              {t(`index.filters.${f}`)}
            </button>
          ))}
        </div>
        {withSearch && (
          <div>
            <label htmlFor="developer-search" className="sr-only">
              {t("index.searchLabel")}
            </label>
            <input
              id="developer-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("index.searchPlaceholder")}
              className="w-56 border border-line bg-surface px-4 py-2 text-sm text-bone placeholder:text-mute focus:border-gold"
            />
          </div>
        )}
      </div>

      <ol className="mt-10 border-t border-line">
        {visible.map((developer) => (
          <li key={developer.slug} className="border-b border-line">
            <Link
              href={`/developers/${developer.slug}`}
              className="group relative grid grid-cols-[auto_1fr_auto] items-baseline gap-x-5 gap-y-2 py-6 transition-colors hover:bg-surface md:grid-cols-[3.5rem_1fr_auto_auto] md:gap-x-8 md:px-4 md:py-7"
            >
              {/* Gold bar grows on hover (§6 motion) */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 start-0 w-0.5 scale-y-0 bg-gold transition-transform duration-300 group-hover:scale-y-100"
              />
              <span className="font-mono text-sm font-medium text-gold">
                {padRank(developer.rank)}
              </span>
              <span className="min-w-0">
                <span className="block font-display text-2xl leading-tight text-bone transition-colors group-hover:text-gold-bright md:text-4xl">
                  {developer.name}
                </span>
                {developer.projects.length > 0 && (
                  <span className="mt-1.5 block truncate text-sm text-mute">
                    {developer.projects
                      .slice(0, 3)
                      .map((p) => p.name)
                      .join(" · ")}
                  </span>
                )}
              </span>
              <span className="col-start-2 flex items-center gap-4 md:col-start-3">
                <span className="border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-sand uppercase">
                  {developer.segment
                    ? t(`segment.${developer.segment}`)
                    : t("segment.tbc")}
                </span>
                {developer.stats?.salesValue2025AED ? (
                  <span className="hidden font-mono text-sm text-sand lg:inline">
                    {formatAED(developer.stats.salesValue2025AED, locale)}
                  </span>
                ) : developer.stats?.unitsDelivered ? (
                  <span className="hidden font-mono text-sm text-sand lg:inline">
                    {formatNumber(developer.stats.unitsDelivered, locale)}{" "}
                    {t("developer.statsUnits")}
                  </span>
                ) : null}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                size={20}
                className="hidden translate-y-1 text-mute opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-gold group-hover:opacity-100 md:block rtl:-scale-x-100"
              />
            </Link>
          </li>
        ))}
      </ol>

      {visible.length === 0 && (
        <p className="py-12 text-center text-mute">{t("index.empty")}</p>
      )}
    </div>
  );
}
