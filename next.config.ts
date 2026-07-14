import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // SVG is only used for the swappable placeholder art shipped in /public.
  // The CSP sandbox below keeps optimized SVG delivery safe.
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // The production developers.json may reference externally hosted imagery.
      { protocol: "https", hostname: "**" },
    ],
  },
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
