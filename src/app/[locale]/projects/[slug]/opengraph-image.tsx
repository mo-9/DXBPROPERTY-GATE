import { getDeveloper, getProject } from "@/lib/data";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Project — DXBPROPERTY GATE";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  const developer = project ? getDeveloper(project.developerSlug) : undefined;
  return renderOgImage({
    eyebrow: project ? `${project.area} · Dubai` : "Project",
    title: project?.name ?? "DXBPROPERTY GATE",
    footer: developer?.name ?? "Dubai, UAE",
  });
}
