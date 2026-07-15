import Image from "next/image";
import { getLocale } from "next-intl/server";
import { heroAlt, heroImages } from "@/lib/heroImages";

/**
 * A slow marquee of Dubai landmark photography under the hero — pairs with
 * the developer-name ticker. Renders nothing until photos are supplied.
 */
export async function LandmarkStrip() {
  const locale = await getLocale();
  if (heroImages.length < 3) return null;

  const sequence = (hidden: boolean) => (
    <div className="flex shrink-0 gap-4 pe-4" aria-hidden={hidden || undefined}>
      {heroImages.map((image) => (
        <div
          key={image.src}
          className="relative h-40 w-64 shrink-0 overflow-hidden border border-white/60 shadow-sm md:h-48 md:w-80"
        >
          <Image
            src={image.src}
            alt={hidden ? "" : heroAlt(image, locale)}
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="ticker overflow-hidden border-b border-line bg-surface-2/60 py-6">
      <div className="ticker-track" dir="ltr">
        {sequence(false)}
        {sequence(true)}
      </div>
    </section>
  );
}
