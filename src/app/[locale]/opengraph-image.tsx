import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "DXBPROPERTY GATE — The Dubai Developer Index";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return renderOgImage({
    eyebrow:
      locale === "ar" ? "مؤشر مطوّري دبي · 2026" : "The Dubai Developer Index · 2026",
    title:
      locale === "ar"
        ? "كل مطوّري دبي. بوابة واحدة."
        : "Every Dubai developer. One gate.",
  });
}
