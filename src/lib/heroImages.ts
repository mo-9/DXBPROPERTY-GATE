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
 * Landmark photos for the homepage. Each manifest entry is resolved against
 * the filesystem at build time, trying common photo formats (.jpg listed,
 * plus .avif/.webp/.jpeg/.png variants of the same basename) — drop a photo
 * in any of these formats and it is picked up automatically. Entries with no
 * file present are skipped; with none at all, the hero falls back to the
 * gold-glow treatment.
 */
const EXTENSIONS = [".jpg", ".jpeg", ".avif", ".webp", ".png"];

function resolveExisting(src: string): string | null {
  const base = src.replace(/\.[a-z0-9]+$/i, "");
  for (const ext of EXTENSIONS) {
    const candidate = `${base}${ext}`;
    if (existsSync(join(process.cwd(), "public", candidate))) return candidate;
  }
  return null;
}

export const heroImages: HeroImage[] = (heroImagesJson.images as HeroImage[])
  .map((image) => {
    const resolved = resolveExisting(image.src);
    return resolved ? { ...image, src: resolved } : null;
  })
  .filter((image): image is HeroImage => image !== null);

export function heroAlt(image: HeroImage, locale: string): string {
  return locale === "ar" ? image.altAr : image.altEn;
}
