import type { ReactNode } from "react";

/** Standard section head: mono eyebrow over a Bodoni title (§6). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <Heading className={`${Heading === "h1" ? "title-hero" : "title-section"} mt-4 text-balance`}>
        {title}
      </Heading>
      {intro && <p className="mt-5 text-sand">{intro}</p>}
    </div>
  );
}
