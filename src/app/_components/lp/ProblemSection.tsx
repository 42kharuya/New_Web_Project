"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { LP_CONTENT } from "./content";

/**
 * ProblemSection — 課題共感を作るセクション
 */
export function ProblemSection() {
  const { problem } = LP_CONTENT;

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
          {problem.heading}
        </motion.h2>
        <ul className="mx-auto mt-10 max-w-lg space-y-4">
          {problem.items.map((item, i) => (
            <motion.li
              key={item}
              initial={fadeUp.initial}
              whileInView={fadeUp.animate}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 text-base font-medium leading-relaxed text-gray-900"
            >
              <span
                className="mt-0.5 flex-shrink-0 text-sm font-semibold text-indigo-600"
                aria-hidden="true"
              >
                ✕
              </span>
              {item}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
