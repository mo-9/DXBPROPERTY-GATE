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

## Data — IMPORTANT

`src/data/developers.json` currently contains a **seed dataset**: only the facts
pinned by the brief itself (the 26 developer slugs/names/ranks/segments from
§14 and the Appendix A Emaar worked example). **No real-world data has been
fabricated** — projects, prices, handover dates, permits, stats, headlines and
descriptions for the other 25 developers are intentionally absent and their
pages render gracefully without them.

**To light up the full site, replace `src/data/developers.json` with the
supplied dataset** (schema in `src/lib/types.ts`, validated with zod at build
time — a malformed file fails the build). The same applies to
`src/data/market.json` (homepage market-context strip: hidden until verified
figures are supplied) and the placeholder hero art in `public/img/placeholders/`.

Notes on two schema fields (flagged per brief §0):

- `Developer.segment`, `headline`, `description` are optional in the TS type
  because the brief marks ZOYA's segment/profile "TO BE SUPPLIED" and the
  no-fabrication rule forbids inventing editorial copy. Pages omit missing
  fields; nothing is guessed.

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
