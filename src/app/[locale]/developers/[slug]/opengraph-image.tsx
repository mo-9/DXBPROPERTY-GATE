import { getDeveloper } from "@/lib/data";
import { padRank } from "@/lib/format";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Developer profile — DXBPROPERTY GATE";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const developer = getDeveloper(slug);
  return renderOgImage({
    eyebrow: developer ? `No. ${padRank(developer.rank)} / 26` : "Developer",
    title: developer?.name ?? "DXBPROPERTY GATE",
    footer: developer?.headline ?? "Dubai, UAE",
  });
}
