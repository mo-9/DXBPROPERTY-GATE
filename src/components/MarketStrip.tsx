import { getLocale, getTranslations } from "next-intl/server";
import { marketStats } from "@/lib/data";
import { formatAED, formatNumber } from "@/lib/format";
import { Reveal } from "./Reveal";

/**
 * Market context strip (§7.1.4) — three verified mono stats. Values live in
 * src/data/market.json; the strip renders nothing until real, verified
 * figures are supplied (no-fabrication rule, §12).
 */
export async function MarketStrip() {
  const t = await getTranslations("market");
  const locale = await getLocale();

  const stats: { label: string; value: string }[] = [];
  if (marketStats.transactionValue2025AED) {
    stats.push({
      label: t("transactionValue"),
      value: formatAED(marketStats.transactionValue2025AED, locale),
    });
  }
  if (marketStats.dealCount2025) {
    stats.push({
      label: t("dealCount"),
      value: formatNumber(marketStats.dealCount2025, locale),
    });
  }
  if (marketStats.activeInvestors2025) {
    stats.push({
      label: t("activeInvestors"),
      value: formatNumber(marketStats.activeInvestors2025, locale),
    });
  }

  if (stats.length === 0) return null;

  return (
    <section aria-label={t("eyebrow")} className="border-b border-line">
      <div className="container-gate grid gap-px overflow-hidden py-12 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="px-2 py-4 text-center sm:py-2">
              <p className="font-mono text-3xl font-medium text-bone md:text-4xl">
                {stat.value}
              </p>
              <p className="eyebrow mt-3 !text-mute text-[11px]">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
