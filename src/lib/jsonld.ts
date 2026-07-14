import type { Area, Developer, Project } from "./types";
import { SITE_NAME, SITE_URL, localePath } from "./site";

/**
 * JSON-LD builders (§10). All values come from the dataset — fields that are
 * unverified/absent are simply not emitted.
 */

type JsonLdObject = Record<string, unknown>;

const url = (locale: string, path: string) =>
  `${SITE_URL}${localePath(locale, path)}` || SITE_URL;

export function organizationJsonLd(locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/img/og-default.png`,
    areaServed: { "@type": "City", name: "Dubai" },
  };
}

export function webSiteJsonLd(locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ["en", "ar"],
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url(locale, "/developers")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function developerJsonLd(developer: Developer, locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    name: developer.name,
    url: url(locale, `/developers/${developer.slug}`),
    ...(developer.website ? { sameAs: [developer.website] } : {}),
    ...(developer.founded ? { foundingDate: developer.founded } : {}),
    ...(developer.description ? { description: developer.description } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
  };
}

export function projectJsonLd(
  project: Project,
  developer: Developer | undefined,
  locale: string
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: project.name,
    url: url(locale, `/projects/${project.slug}`),
    description: project.description,
    ...(project.priceFromAED
      ? {
          offers: {
            "@type": "Offer",
            price: project.priceFromAED,
            priceCurrency: "AED",
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
    ...(developer
      ? {
          provider: {
            "@type": "Organization",
            name: developer.name,
            url: url(locale, `/developers/${developer.slug}`),
          },
        }
      : {}),
    spatialCoverage: {
      "@type": "Place",
      name: `${project.area}, Dubai`,
      ...(project.coordinates
        ? {
            geo: {
              "@type": "GeoCoordinates",
              latitude: project.coordinates.lat,
              longitude: project.coordinates.lng,
            },
          }
        : {}),
    },
  };
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export function faqJsonLd(entries: FaqEntry[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };
}

export interface Crumb {
  name: string;
  path?: string; // omit on the final crumb
}

export function breadcrumbJsonLd(crumbs: Crumb[], locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: url(locale, crumb.path) } : {}),
    })),
  };
}
