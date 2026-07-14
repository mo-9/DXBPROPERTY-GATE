/** Site-wide constants. `SITE_URL` must be set in production for canonical URLs. */
export const SITE_NAME = "DXBPROPERTY GATE";
export const SITE_TAGLINE = "Every Dubai developer. One gate.";
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dxbpropertygate.com"
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === "/" ? "" : path}` || SITE_URL;
}

/** Locale-aware path (en at root, ar prefixed) — mirrors routing config. */
export function localePath(locale: string, path: string): string {
  const p = path === "/" ? "" : path;
  return locale === "en" ? p || "/" : `/${locale}${p}`;
}
