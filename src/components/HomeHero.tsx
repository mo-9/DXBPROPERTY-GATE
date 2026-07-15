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

  return (
    <section className="hero-glow relative flex min-h-svh items-center">
      <HeroBackdrop images={images} />
      <div className="container-gate relative pt-28 pb-24 md:pt-32">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.09 }}
        >
          <motion.p
            variants={item}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="eyebrow"
          >
            {t("hero.eyebrow")}
          </motion.p>
          <motion.h1
            variants={item}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="title-hero mt-6 max-w-5xl text-balance"
          >
            {t("hero.titleLead")}{" "}
            <em className="italic text-gold">{t("hero.titleItalic")}</em>{" "}
            {t("hero.titleTail")}
          </motion.h1>
          <motion.p
            variants={item}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-7 max-w-xl text-lg text-sand"
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
              className="border border-line-strong px-7 py-3.5 text-bone transition-colors hover:border-gold hover:text-gold"
            >
              {t("common.browseIndex")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
