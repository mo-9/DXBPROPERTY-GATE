import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { LenisProvider } from "@/components/LenisProvider";
import { LeadModalProvider } from "@/components/lead/LeadModalProvider";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0F0D0A",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={fontVariables}
      // Lenis toggles classes on <html> after hydration
      suppressHydrationWarning
    >
      <body>
        <JsonLd data={organizationJsonLd(locale)} />
        <JsonLd data={webSiteJsonLd(locale)} />
        <NextIntlClientProvider>
          <LeadModalProvider>
            <a
              href="#content"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-100 focus:bg-gold focus:px-4 focus:py-2 focus:text-bg"
            >
              {t("skipToContent")}
            </a>
            <LenisProvider />
            <Header />
            <main id="content">{children}</main>
            <Footer />
          </LeadModalProvider>
        </NextIntlClientProvider>
        <Analytics />
        {/* Beacon script only exists on Vercel hosting — skip elsewhere */}
        {process.env.VERCEL === "1" && <VercelAnalytics />}
      </body>
    </html>
  );
}
