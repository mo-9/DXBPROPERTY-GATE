# DXBPROPERTY GATE

**Every Dubai developer. One gate.**

A production, SEO-first real-estate discovery platform for the Dubai market — the
emirate's top 26 developers and their projects, organised as a curated index.
Built to the DXBPROPERTY GATE technical brief.

## Stack

- **Next.js 15** (App Router) · **TypeScript** (strict) · **Tailwind CSS 4**
- SSG + ISR (`generateStaticParams` + `revalidate`) for every developer / project / area page, in both locales
- **next-intl** — `en` at the root, `ar` mirror at `/ar` (full RTL via CSS logical properties)
- **framer-motion** (reveals, modal) · **lenis** (smooth scroll) · CSS keyframes (ticker) — all gated behind `prefers-reduced-motion`
- Self-hosted, subset fonts via `next/font/local`: Bodoni Moda (display), Hanken Grotesk (body), JetBrains Mono (data), Amiri + IBM Plex Sans Arabic (Arabic)
- JSON-LD (`Organization`, `WebSite`+SearchAction, `RealEstateAgent`, `RealEstateListing`, `FAQPage`, `BreadcrumbList`), per-page metadata + hreflang, dynamic OG images via `next/og`, `sitemap.xml`, `robots.txt`

## Routes

```
/                          Homepage (hero → ticker → market strip → The Index → featured → why → CTA)
/developers                All 26 developers (segment filter + search)
/developers/[slug]         Developer profile + projects
/projects/[slug]           Project detail (verified facts only, sticky mobile CTA)
/areas                     Area index
/areas/[slug]              Area landing page (projects, developers, FAQ)
/about                     About / trust
/ar/...                    Arabic mirror of everything
/api/lead                  Lead capture endpoint
```

## Data

`src/data/developers.json` contains a **researched dataset (compiled July
2026)**: 26 developers and 175 real projects across 62 areas, sourced from
official developer websites and corroborating market coverage. Prices,
handover dates and payment plans appear only where published by the developer
or a reliable current source — absent fields are unverified, never guessed
(brief §12). `src/data/market.json` carries the DLD-reported full-year 2025
figures (AED 917bn+, 270k+ transactions, 193,100 active investors) per Dubai
Media Office / DOF press releases.

The file remains fully swappable: replace it with an updated dataset any time
(schema in `src/lib/types.ts`, zod-validated at build — a malformed file fails
the build). Hero imagery is placeholder art in `public/img/placeholders/`,
swappable per entity via the data file.

Editorial notes:

- Off-plan figures (prices, quarters, plans) are snapshots and should be
  re-verified against the developer/DLD on a regular cadence.
- ZOYA (rank 26) was matched to Zoya Developments (zoyadevelopments.ae) —
  confirm this is the intended client entity; its segment is a curated
  classification ("boutique"), marked TBD in the original brief.
- Non-Dubai projects surfaced in research (Aldar's Abu Dhabi communities,
  Mira's Ras Al Khaimah JV) were excluded — the platform is scoped to the
  Dubai market (§1).
- `Developer.segment`, `headline`, `description` are optional in the TS type
  so an incomplete future dataset still builds; pages omit missing fields.

## Lead capture

- Modal fires once per session: 7s after load, exit-intent, or ≥60% scroll —
  whichever comes first (`sessionStorage` guard). A successful submit sets a
  30-day cookie so converted visitors are never nagged again.
- Silently attaches developer/project context on entity pages.
- Fully accessible: `role="dialog"`, focus trap, `Esc`/backdrop/× close, focus
  restore, first field auto-focused.
- `POST /api/lead`: zod validation, honeypot + min-time-to-submit trap
  (silent 200 for bots), best-effort rate limit, E.164 phone normalisation.
- Persistence is swappable behind `saveLead()` — FastAPI proxy →
  Supabase/Postgres → notification-only fallback. Sales notifications via
  Resend email + WhatsApp Business Cloud API. GA4 + Meta Pixel `Lead` events
  fire client-side on success. No PII in logs.

Configure everything via environment variables — see `.env.example`.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # strict TS
npm run build      # full SSG build (validates developers.json)
```

## Deploy

Built for Vercel. Set `NEXT_PUBLIC_SITE_URL` to the production origin
(canonicals, hreflang, sitemap and OG URLs derive from it), plus the lead
backend/notification vars from `.env.example`.

## Compliance

Project data is indicative. Verify licensing and permits via the Dubai Land
Department (Dubai REST) before any transaction. This disclaimer is rendered
site-wide in the footer in both languages.
