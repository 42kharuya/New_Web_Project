"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/lib/motion";
import { FREE_FEATURES, PRO_FEATURES } from "@/config/plans";

export function HomePageClient() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ナビゲーション */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-xl font-black tracking-tight text-indigo-600">〆トラ</span>
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            ログイン / 無料登録
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <motion.section
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-4xl px-6 py-24 text-center"
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-black tracking-tighter text-gray-900 sm:text-7xl"
          >
            締切ミスを、
            <br />
            <span className="text-indigo-600">もうしない。</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-xl text-lg text-gray-600"
          >
            ES・説明会・面接の締切を一元管理し、
            <br className="hidden sm:block" />
            締切前にメールで通知。就活の出し忘れを防ぎます。
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex justify-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
            >
              無料ではじめる
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-sm text-gray-400">
            クレジットカード不要 · 10件まで無料
          </motion.p>
        </motion.section>

        {/* Problem */}
        <section className="bg-gray-50 py-20">
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-80px" }}
            transition={fadeUp.transition}
            className="mx-auto max-w-4xl px-6"
          >
            <h2 className="text-center text-3xl font-bold text-gray-900">
              こんな経験、ありませんか？
            </h2>
            <ul className="mx-auto mt-8 max-w-md space-y-4 text-gray-700">
              {[
                "気づいたら締切が過ぎていた",
                "複数の企業の締切を覚えきれない",
                "Notionに書いたけど更新が止まった",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-base">
                  <span className="mt-0.5 font-bold text-red-500">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* Pricing */}
        <section className="mx-auto max-w-4xl px-6 py-24">
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-80px" }}
            transition={fadeUp.transition}
          >
            <h2 className="text-center text-3xl font-bold text-gray-900">
              シンプルな料金プラン
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {/* Free */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Free</p>
                <p className="mt-2 text-4xl font-black text-gray-900">
                  ¥0<span className="text-base font-normal text-gray-400">/月</span>
                </p>
                <p className="mt-1 text-sm text-gray-400">ずっと無料</p>
                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-gray-400">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="mt-8 block rounded-xl border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  無料ではじめる
                </Link>
              </div>

              {/* Pro */}
              <div className="rounded-2xl border-2 border-indigo-500 bg-white p-8 shadow-lg shadow-indigo-100/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Pro</p>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">おすすめ</span>
                </div>
                <p className="mt-2 text-4xl font-black text-gray-900">
                  ¥980<span className="text-base font-normal text-gray-400">/月</span>
                </p>
                <p className="mt-1 text-sm text-gray-400">税込</p>
                <ul className="mt-6 space-y-3 text-sm text-gray-700">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="font-bold text-indigo-500">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="mt-8 block rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Pro ではじめる
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="bg-gray-50 py-24">
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-80px" }}
            transition={fadeUp.transition}
            className="mx-auto max-w-xl px-6 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              まず無料で試してみる
            </h2>
            <p className="mt-4 text-gray-600">
              登録はメールアドレスだけ。30秒ではじめられます。
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-xl bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
            >
              無料登録はこちら
            </Link>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © 2026 〆トラ
      </footer>
    </div>
  );
}
