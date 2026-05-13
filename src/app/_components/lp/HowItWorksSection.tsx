"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { LP_CONTENT } from "./content";

/**
 * HowItWorksSection — 価値の流れを3ステップで示すセクション
 */
export function HowItWorksSection() {
  const { howItWorks } = LP_CONTENT;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={fadeUp.transition}
          className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          {howItWorks.heading}
        </motion.h2>
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {howItWorks.steps.map(({ number, label }, i) => (
            <motion.div
              key={number}
              initial={fadeUp.initial}
              whileInView={fadeUp.animate}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              <div
                className="mb-4 text-3xl font-bold text-indigo-600"
                aria-label={`ステップ ${number}`}
              >
                {number}
              </div>
              <p className="text-base font-medium leading-relaxed text-gray-900">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
