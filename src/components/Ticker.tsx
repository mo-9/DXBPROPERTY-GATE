import { developers } from "@/lib/data";
import { getTranslations } from "next-intl/server";

/**
 * The market ticker (§6 signature): a slow seamless marquee of all 26
 * developer names, separated by a gold ◆. Pure CSS animation — pauses on
 * hover/focus, static under prefers-reduced-motion. The list is duplicated
 * once for the seamless loop; the copy is aria-hidden.
 */
export async function Ticker() {
  const t = await getTranslations("ticker");
  const names = developers.map((d) => d.name);

  const sequence = (hidden: boolean) => (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {names.map((name) => (
        <span key={name} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-mono text-sm font-medium tracking-[0.08em] text-sand">
            {name}
          </span>
          <span className="text-[9px] text-gold" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section
      className="ticker overflow-hidden border-y border-line bg-surface py-4"
      aria-label={t("label")}
    >
      <div className="ticker-track" dir="ltr">
        {sequence(false)}
        {sequence(true)}
      </div>
    </section>
  );
}
