/** Number formatting for mono data figures. Latin digits in both locales — the mono "index" figures are part of the brand system. */
export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-AE").format(
    value
  );
}

export function formatAED(value: number, locale: string): string {
  return `AED ${formatCompact(value, locale)}`;
}

/** 61_000_000_000 -> "61B", 1_250_000 -> "1.25M" — ticker/stat style. */
export function formatCompact(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE-u-nu-latn" : "en-AE", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function padRank(rank: number): string {
  return String(rank).padStart(2, "0");
}
