import type { MetadataRoute } from "next";
import { areas, developers, projects } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { SITE_URL, localePath } from "@/lib/site";

/**
 * sitemap.xml (§10) — every route for every entity, both locales, with
 * hreflang alternates per entry.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/developers", "/areas", "/about"];
  const entityPaths = [
    ...developers.map((d) => `/developers/${d.slug}`),
    ...projects.map((p) => `/projects/${p.slug}`),
    ...areas.map((a) => `/areas/${a.slug}`),
  ];

  const url = (locale: string, path: string) =>
    `${SITE_URL}${localePath(locale, path)}` || SITE_URL;

  return [...staticPaths, ...entityPaths].map((path) => ({
    url: url("en", path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/projects") ? 0.8 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, url(locale, path)])
      ),
    },
  }));
}
