import Image from "next/image";
import type { Developer } from "@/lib/types";

/**
 * The developer's visual identity card on its profile page:
 * - official logo (from public/img/logos/, auto-resolved) centered on a
 *   clean white surface, or
 * - an editorial Bodoni monogram with a gold ring while no logo is supplied.
 */
export function DeveloperMark({
  developer,
  logo,
}: {
  developer: Developer;
  logo: string | null;
}) {
  if (logo) {
    return (
      <div className="relative flex aspect-[16/10] items-center justify-center border border-line bg-white p-10 md:p-14">
        <div className="relative h-full max-h-40 w-full">
          <Image
            src={logo}
            alt={`${developer.name} logo`}
            fill
            sizes="(max-width: 1024px) 80vw, 30vw"
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  const initial = developer.name.trim().charAt(0).toUpperCase();

  return (
    <div className="hero-glow relative flex aspect-[16/10] items-center justify-center border border-line">
      <div className="flex h-36 w-36 items-center justify-center rounded-full border border-gold/60 md:h-44 md:w-44">
        <span
          aria-hidden="true"
          className="font-display text-7xl text-gold md:text-8xl"
        >
          {initial}
        </span>
      </div>
      <span className="absolute bottom-5 font-mono text-[10px] tracking-[0.22em] text-mute uppercase">
        {developer.name}
      </span>
    </div>
  );
}
