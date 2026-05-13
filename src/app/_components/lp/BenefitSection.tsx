"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { LP_CONTENT } from "./content";

/**
 * BenefitSection — 利用後の変化を具体化するセクション
 */
export function BenefitSection() {
  const { benefit } = LP_CONTENT;

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          initial={fadeUp.initial}
          whileInView={fadeUp.animate}
          viewport={{ once: true, margin: "-80px" }}
          transition={fadeUp.transition}
          className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
        >
          {benefit.heading}
        </motion.h2>
        <ul className="mx-auto mt-10 max-w-md space-y-4">
          {benefit.items.map((item, i) => (
            <motion.li
              key={item}
              initial={fadeUp.initial}
              whileInView={fadeUp.animate}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-base font-medium text-gray-900"
            >
              <span
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white"
                aria-hidden="true"
              >
                ✓
              </span>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
