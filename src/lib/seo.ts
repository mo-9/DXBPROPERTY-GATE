import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL, localePath } from "./site";

/**
 * Shared metadata builder — unique title/description, canonical and
 * hreflang pairs for every page in both locales (§10).
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  ogImage,
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogImage?: string;
}): Metadata {
  const canonical = `${SITE_URL}${localePath(locale, path)}` || SITE_URL;
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}` || SITE_URL])
  );

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: { ...languages, "x-default": `${SITE_URL}${localePath("en", path)}` || SITE_URL },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}
