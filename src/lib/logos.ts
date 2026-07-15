import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Developer } from "./types";

/**
 * Official developer logos, resolved from the filesystem at build time.
 * Drop a logo into public/img/logos/ named after the developer slug in any
 * common format (e.g. emaar-properties.svg / azizi-developments.png) and it
 * is picked up automatically. A dataset-supplied `logo` path wins if present.
 * With no logo, pages fall back to an editorial monogram card.
 */
const EXTENSIONS = [".svg", ".png", ".webp", ".jpg", ".jpeg", ".avif"];

export function resolveLogo(developer: Developer): string | null {
  if (developer.logo) return developer.logo;
  for (const ext of EXTENSIONS) {
    const candidate = `/img/logos/${developer.slug}${ext}`;
    if (existsSync(join(process.cwd(), "public", candidate))) return candidate;
  }
  return null;
}
