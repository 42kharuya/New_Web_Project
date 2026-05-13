"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { LP_CONTENT } from "./content";

/**
 * DifferenceSection — 既存手段との違いと価値ループを示すセクション
 */
export function DifferenceSection() {
  const { difference } = LP_CONTENT;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <motion.h2
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={fadeUp.transition}
          className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          {difference.heading}
        </motion.h2>
        <motion.p
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="mx-auto mt-4 max-w-lg text-base font-medium leading-relaxed text-gray-500"
        >
          {difference.body}
        </motion.p>
        {/* 価値ループ */}
        <motion.div
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label="価値ループ"
        >
          {difference.loop.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-900">
                {step}
              </span>
              {i < difference.loop.length - 1 && (
                <span className="font-semibold text-indigo-600" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
