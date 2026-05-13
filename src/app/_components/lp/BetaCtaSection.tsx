"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { LP_CONTENT } from "./content";
import { LeadCaptureDialog } from "./LeadCaptureDialog";

/**
 * BetaCtaSection — 下部の登録導線セクション
 * CTA: 先行利用に登録する
 */
export function BetaCtaSection() {
  const { betaCta } = LP_CONTENT;

  return (
    <section className="bg-indigo-600 py-24 text-center">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={fadeUp.transition}
          className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        >
          {betaCta.heading}
        </motion.h2>
        <motion.p
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed text-indigo-100"
        >
          {betaCta.body}
        </motion.p>
        <motion.div
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="mt-10"
        >
          <LeadCaptureDialog label={betaCta.ctaLabel} ctaLocation="bottom" dark />
        </motion.div>
        <motion.p
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...fadeUp.transition, delay: 0.18 }}
          className="mt-4 text-sm text-indigo-200"
        >
          {betaCta.note}
        </motion.p>
      </div>
    </section>
  );
}
