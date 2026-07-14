import { getArea } from "@/lib/data";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Area guide — DXBPROPERTY GATE";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const area = getArea(slug);
  return renderOgImage({
    eyebrow: "Area Guide · Dubai",
    title: area?.name ?? "DXBPROPERTY GATE",
  });
}
