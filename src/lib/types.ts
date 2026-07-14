/**
 * Data model per brief §5.
 *
 * Deviations (flagged, not invented around — brief §0/§14):
 * - `Developer.segment`, `headline` and `description` are optional here because
 *   the supplied dataset may be incomplete (e.g. ZOYA's segment/profile is
 *   "TO BE SUPPLIED" per §14). Pages render present fields and omit the rest —
 *   they never guess. When the full `developers.json` is dropped in, every
 *   field renders automatically.
 */

export type Segment = "master" | "luxury" | "value" | "boutique";
export type ProjectStatus = "off-plan" | "under-construction" | "ready";

export const UNIT_TYPES = [
  "Studio",
  "1 Bedroom",
  "2 Bedroom",
  "3 Bedroom",
  "Townhouse",
  "Twin house",
  "Penthouse",
  "Villa",
  "Commercial unit",
  "Administrative office",
] as const;

export type UnitType = (typeof UNIT_TYPES)[number];

/** The modal's core option set (§8) — shown first; the rest follow. */
export const MODAL_CORE_UNIT_TYPES: UnitType[] = [
  "Studio",
  "1 Bedroom",
  "2 Bedroom",
  "Twin house",
  "Commercial unit",
  "Administrative office",
];

export const MODAL_EXTRA_UNIT_TYPES: UnitType[] = [
  "3 Bedroom",
  "Townhouse",
  "Penthouse",
];

export interface Project {
  slug: string;
  name: string;
  developerSlug: string;
  area: string;
  areaSlug: string;
  status: ProjectStatus;
  unitTypes: UnitType[];
  priceFromAED?: number;
  handover?: string;
  paymentPlan?: string;
  sizeFromSqft?: number;
  description: string;
  heroImage: string;
  gallery?: string[];
  amenities?: string[];
  reraPermit?: string;
  coordinates?: { lat: number; lng: number };
  featured?: boolean;
}

export interface DeveloperStats {
  salesValue2025AED?: number;
  unitsDelivered?: number;
  roiPercent?: number;
}

export interface Developer {
  slug: string;
  name: string;
  rank: number;
  segment?: Segment;
  founded?: string;
  headline?: string;
  description?: string;
  logo?: string;
  heroImage: string;
  website?: string;
  stats?: DeveloperStats;
  projects: Project[];
}

/** Derived entity — area pages aggregate projects by location (§4/§7.4). */
export interface Area {
  slug: string;
  name: string;
  projects: Project[];
  developers: Developer[];
}

export type LeadSource = "timed-modal" | "exit-intent" | "scroll";

export interface Lead {
  name: string;
  phone: string;
  interest: UnitType;
  developerContext?: string;
  projectContext?: string;
  locale: "en" | "ar";
  source: LeadSource;
  createdAt: string;
}

/** Site-wide verified market stats (§7.1.4). Missing values hide the strip. */
export interface MarketStats {
  transactionValue2025AED?: number;
  dealCount2025?: number;
  activeInvestors2025?: number;
}
