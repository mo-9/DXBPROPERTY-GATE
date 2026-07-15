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
      {/* Photography fully clear — only a short fade at the very bottom to blend into the page */}
      <div className="absolute inset-0 [background:linear-gradient(to_bottom,transparent_78%,var(--bg))]" />
    </div>
  );
}
