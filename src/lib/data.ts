import "server-only";
import { z } from "zod";
import developersJson from "@/data/developers.json";
import marketJson from "@/data/market.json";
import {
  UNIT_TYPES,
  type Area,
  type Developer,
  type MarketStats,
  type Project,
} from "./types";

/**
 * Build-time validation of the supplied developers.json (§5).
 * A malformed dataset fails the build loudly instead of shipping bad pages.
 */
const projectSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  developerSlug: z.string().min(1),
  area: z.string().min(1),
  areaSlug: z.string().min(1),
  status: z.enum(["off-plan", "under-construction", "ready"]),
  unitTypes: z.array(z.enum(UNIT_TYPES)),
  priceFromAED: z.number().positive().optional(),
  handover: z.string().optional(),
  paymentPlan: z.string().optional(),
  sizeFromSqft: z.number().positive().optional(),
  description: z.string().min(1),
  heroImage: z.string().min(1),
  gallery: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  reraPermit: z.string().optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  featured: z.boolean().optional(),
});

const developerSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  rank: z.number().int().min(1),
  segment: z.enum(["master", "luxury", "value", "boutique"]).optional(),
  founded: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  heroImage: z.string().min(1),
  website: z.string().url().optional(),
  stats: z
    .object({
      salesValue2025AED: z.number().positive().optional(),
      unitsDelivered: z.number().positive().optional(),
      roiPercent: z.number().positive().optional(),
    })
    .optional(),
  projects: z.array(projectSchema).max(10),
});

const datasetSchema = z.object({
  $comment: z.string().optional(),
  developers: z.array(developerSchema),
});

const dataset = datasetSchema.parse(developersJson);

export const developers: Developer[] = [...dataset.developers].sort(
  (a, b) => a.rank - b.rank
);

export const projects: Project[] = developers.flatMap((d) => d.projects);

const developerBySlug = new Map(developers.map((d) => [d.slug, d]));
const projectBySlug = new Map(projects.map((p) => [p.slug, p]));

export function getDeveloper(slug: string): Developer | undefined {
  return developerBySlug.get(slug);
}

export function getProject(slug: string): Project | undefined {
  return projectBySlug.get(slug);
}

/** Areas are derived from project locations — one page per referenced area (§4). */
export const areas: Area[] = (() => {
  const map = new Map<string, Area>();
  for (const project of projects) {
    let area = map.get(project.areaSlug);
    if (!area) {
      area = { slug: project.areaSlug, name: project.area, projects: [], developers: [] };
      map.set(project.areaSlug, area);
    }
    area.projects.push(project);
    const dev = developerBySlug.get(project.developerSlug);
    if (dev && !area.developers.some((d) => d.slug === dev.slug)) {
      area.developers.push(dev);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
})();

const areaBySlug = new Map(areas.map((a) => [a.slug, a]));

export function getArea(slug: string): Area | undefined {
  return areaBySlug.get(slug);
}

export const featuredProjects: Project[] = projects.filter((p) => p.featured);

export function relatedDevelopers(developer: Developer, limit = 4): Developer[] {
  if (!developer.segment) return [];
  return developers
    .filter((d) => d.segment === developer.segment && d.slug !== developer.slug)
    .slice(0, limit);
}

export function projectsByDeveloper(slug: string, excludeProject?: string): Project[] {
  return projects.filter(
    (p) => p.developerSlug === slug && p.slug !== excludeProject
  );
}

export function projectsInArea(areaSlug: string, excludeProject?: string): Project[] {
  return projects.filter(
    (p) => p.areaSlug === areaSlug && p.slug !== excludeProject
  );
}

const marketSchema = z.object({
  $comment: z.string().optional(),
  transactionValue2025AED: z.number().positive().nullable(),
  dealCount2025: z.number().positive().nullable(),
  activeInvestors2025: z.number().positive().nullable(),
});

const market = marketSchema.parse(marketJson);

export const marketStats: MarketStats = {
  transactionValue2025AED: market.transactionValue2025AED ?? undefined,
  dealCount2025: market.dealCount2025 ?? undefined,
  activeInvestors2025: market.activeInvestors2025 ?? undefined,
};
