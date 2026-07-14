import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
  // English lives at the root (`/developers/...`), Arabic mirrors at `/ar/...` (§4).
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
