import "server-only";
import { existsSync } from "node:fs";
import { join } from "node:path";
import heroImagesJson from "@/data/hero-images.json";

export interface HeroImage {
  src: string;
  altEn: string;
  altAr: string;
  night: boolean;
}

/**
 * Landmark photos for the homepage. Filtered against the filesystem at
 * build time so missing files are skipped silently — the hero falls back
 * to the gold-glow treatment when no photography has been supplied yet.
 */
export const heroImages: HeroImage[] = (
  heroImagesJson.images as HeroImage[]
).filter((image) => existsSync(join(process.cwd(), "public", image.src)));

export function heroAlt(image: HeroImage, locale: string): string {
  return locale === "ar" ? image.altAr : image.altEn;
}
