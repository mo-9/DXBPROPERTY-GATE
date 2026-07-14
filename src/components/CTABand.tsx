import { getTranslations } from "next-intl/server";
import { Reveal } from "./Reveal";
import { RegisterInterestButton } from "./lead/RegisterInterestButton";

/** Reusable conversion band above the footer. */
export async function CTABand() {
  const t = await getTranslations();
  return (
    <section className="border-t border-line bg-surface">
      <div className="container-gate section-pad text-center">
        <Reveal>
          <h2 className="title-section mx-auto max-w-2xl text-balance">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sand">{t("cta.body")}</p>
          <div className="mt-9">
            <RegisterInterestButton className="bg-gold px-8 py-4 font-medium text-bg transition-colors hover:bg-gold-bright">
              {t("common.registerInterest")}
            </RegisterInterestButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
