import localFont from "next/font/local";

/**
 * Self-hosted, subset font files (§3/§10) — no external requests, no CLS.
 * Latin set: Bodoni Moda (display) / Hanken Grotesk (body) / JetBrains Mono (data).
 * Arabic set: Amiri (display) / IBM Plex Sans Arabic (body) — loaded without
 * preload so English pages don't pay for them; `globals.css` swaps the
 * font stacks under `html[lang="ar"]`.
 */

export const bodoni = localFont({
  src: [
    { path: "../fonts/bodoni-moda-latin-var.woff2", style: "normal" },
    { path: "../fonts/bodoni-moda-italic-latin-var.woff2", style: "italic" },
  ],
  weight: "400 900",
  variable: "--font-bodoni",
  display: "swap",
});

export const hanken = localFont({
  src: "../fonts/hanken-grotesk-latin-var.woff2",
  weight: "100 900",
  variable: "--font-hanken",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono-latin-var.woff2",
  weight: "100 800",
  variable: "--font-jbmono",
  display: "swap",
});

export const amiri = localFont({
  src: [
    { path: "../fonts/amiri-arabic-400.woff2", weight: "400" },
    { path: "../fonts/amiri-arabic-700.woff2", weight: "700" },
  ],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});

export const plexArabic = localFont({
  src: [
    { path: "../fonts/plex-sans-arabic-400.woff2", weight: "400" },
    { path: "../fonts/plex-sans-arabic-500.woff2", weight: "500" },
    { path: "../fonts/plex-sans-arabic-600.woff2", weight: "600" },
  ],
  variable: "--font-plexar",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  bodoni.variable,
  hanken.variable,
  jetbrainsMono.variable,
  amiri.variable,
  plexArabic.variable,
].join(" ");
