"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { HeroBackdrop } from "./HeroBackdrop";
import { RegisterInterestButton } from "./lead/RegisterInterestButton";

/**
 * Homepage hero: full viewport over crossfading Dubai landmark photography
 * (white translucent veil), staggered eyebrow → headline → subhead → CTAs.
 * Falls back to the gold-glow treatment when no photos are supplied.
 */
export function HomeHero({
  images = [],
}: {
  images?: { src: string; alt: string }[];
}) {
  const t = useTranslations();
  const reducedMotion = useReducedMotion();

  const item = {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
  };

  // Photo mode: the picture stays fully clear, so the copy flips to white
  // with a soft dark shadow. Without photos, the light editorial ink returns.
  const photoMode = images.length > 0;

  return (
    <section className="hero-glow relative flex min-h-svh items-center">
      <HeroBackdrop images={images} />
      <div className="container-gate relative pt-28 pb-24 md:pt-32">
        {/* No overlay on the photo — legibility comes from white copy + soft dark shadow */}
        <motion.div
          className={`relative ${
            photoMode
              ? "[text-shadow:0_2px_18px_rgb(0_0_0/0.55),0_1px_3px_rgb(0_0_0/0.45)]"
              : ""
          }`}
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.09 }}
        >
          <motion.p
            variants={item}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`eyebrow ${photoMode ? "!text-gold-bright" : ""}`}
          >
            {t("hero.eyebrow")}
          </motion.p>
          <motion.h1
            variants={item}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`title-hero mt-6 max-w-5xl text-balance ${
              photoMode ? "!text-white" : ""
            }`}
          >
            {t("hero.titleLead")}{" "}
            <em className={`italic ${photoMode ? "text-gold-bright" : "text-gold"}`}>
              {t("hero.titleItalic")}
            </em>{" "}
            {t("hero.titleTail")}
          </motion.h1>
          <motion.p
            variants={item}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`mt-7 max-w-xl text-lg ${
              photoMode ? "text-white/95" : "text-sand"
            }`}
          >
            {t("hero.subhead")}
          </motion.p>
          <motion.div
            variants={item}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <RegisterInterestButton className="bg-gold px-7 py-3.5 font-medium text-bg transition-colors hover:bg-gold-bright">
              {t("common.registerInterest")}
            </RegisterInterestButton>
            <Link
              href="/developers"
              className={
                photoMode
                  ? "border border-white/70 bg-white/15 px-7 py-3.5 text-white backdrop-blur-sm transition-colors hover:border-gold-bright hover:text-gold-bright"
                  : "border border-line-strong bg-white/60 px-7 py-3.5 text-bone backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
              }
            >
              {t("common.browseIndex")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
