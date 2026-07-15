"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface BackdropImage {
  src: string;
  alt: string;
}

/**
 * Full-bleed landmark photography behind the homepage hero: a slow
 * crossfade through the supplied day/night shots, veiled by a translucent
 * white gradient so the espresso-ink headline stays readable.
 * Static (first image only) under prefers-reduced-motion.
 */
export function HeroBackdrop({ images }: { images: BackdropImage[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % images.length),
      6000
    );
    return () => window.clearInterval(id);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {images.map((image, i) => (
        <Image
          key={image.src}
          src={image.src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-2000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* Translucent white veil — lighter wash so the photography shows through */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-bg" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/15 to-transparent rtl:bg-gradient-to-l" />
    </div>
  );
}
