"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { LP_CONTENT } from "./content";
import { LeadCaptureDialog } from "./LeadCaptureDialog";

/**
 * HeroSection — 誰向けの価値かを最初に伝えるセクション
 * CTA: 先行利用に登録する
 */
export function HeroSection() {
  const { hero } = LP_CONTENT;

  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center">
      <motion.div
        initial="initial"
        animate="animate"
        variants={stagger}
        className="flex flex-col items-center"
      >
        <motion.h1
          variants={fadeUp}
          transition={fadeUp.transition}
          className="mx-auto max-w-2xl text-5xl font-black tracking-tighter text-gray-900 sm:text-7xl"
        >
          {hero.heading}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          transition={fadeUp.transition}
          className="mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-gray-500"
        >
          {hero.subCopy}
        </motion.p>
        <motion.div
          variants={fadeUp}
          transition={fadeUp.transition}
          className="mt-10"
        >
          <LeadCaptureDialog label={hero.ctaLabel} ctaLocation="hero" />
        </motion.div>
        <motion.p
          variants={fadeUp}
          transition={fadeUp.transition}
          className="mt-4 text-sm text-gray-500"
        >
          {hero.note}
        </motion.p>
      </motion.div>
    </section>
  );
}
