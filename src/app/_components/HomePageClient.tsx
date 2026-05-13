"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { FREE_FEATURES, PRO_FEATURES } from "@/config/plans";

const PROBLEMS = [
  { icon: "📭", text: "気づいたら締切が過ぎていた" },
  { icon: "🗂️", text: "複数企業の締切を覚えきれない" },
  { icon: "😓", text: "Notion に書いたが更新が止まった" },
];

const HOW_STEPS = [
  { num: "01", title: "締切を登録する", desc: "企業名・種別・締切日時をサッと入力。リンクやメモも保存できます。" },
  { num: "02", title: "通知が届く", desc: "締切の 72時間前・24時間前・3時間前にメールで通知します。" },
  { num: "03", title: "出し忘れゼロへ", desc: "通知を受け取り、ステータスを更新。就活の締切を確実に守れます。" },
];

export function HomePageClient() {
  return (
    <div className="min-h-screen bg-[var(--paper)] font-sans">
      {/* ── ナビゲーション ── */}
      <header
        className="sticky top-0 z-10 border-b border-[var(--rule)]"
        style={{
          background: "color-mix(in oklab, var(--paper) 92%, transparent)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
            <span
              className="brand-seal relative inline-flex h-[28px] w-[28px] items-center justify-center rounded-[8px] bg-[var(--ink)] text-white"
              style={{
                fontFamily: '"Noto Sans JP", serif',
                fontWeight: 900,
                fontSize: 16,
                transform: "rotate(-4deg)",
              }}
              aria-hidden="true"
            >
              〆
            </span>
            <span className="text-[16px] text-[var(--ink)]">トラ</span>
          </div>
          <Link
            href="/login"
            className="rounded-[10px] bg-[var(--ink)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand"
          >
            ログイン / 無料登録
          </Link>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="mx-auto max-w-5xl px-6 py-20 lg:py-28">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* 左: テキスト */}
            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={fadeUp.transition}
              className="stagger"
            >
              {/* 大きなシール */}
              <div
                className="big-seal relative mb-8 inline-flex h-[80px] w-[80px] items-center justify-center rounded-[20px] bg-[var(--ink)] text-white lg:h-[96px] lg:w-[96px] lg:rounded-[24px]"
                style={{
                  fontFamily: '"Noto Sans JP", serif',
                  fontWeight: 900,
                  fontSize: 48,
                  letterSpacing: "-0.04em",
                  transform: "rotate(-3deg)",
                }}
              >
                〆
              </div>

              <h1
                className="text-[40px] font-black text-[var(--ink)] leading-tight sm:text-[52px] lg:text-[56px]"
                style={{ letterSpacing: "-0.035em" }}
              >
                締切ミスを、<br />
                <span style={{ color: "var(--brand)" }}>もうしない。</span>
              </h1>
              <p className="mt-5 max-w-md text-[var(--ink-2)] leading-relaxed lg:text-lg">
                ES・説明会・面接の締切を一元管理。<br />
                締切前にメールで通知し、就活の出し忘れを防ぎます。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-[14px] bg-[var(--ink)] px-7 py-3.5 text-base font-bold text-[var(--paper)] transition-all hover:bg-brand hover:-translate-y-px"
                  style={{ boxShadow: "0 8px 24px -8px rgba(15,13,26,0.4)" }}
                >
                  無料ではじめる
                </Link>
                <Link
                  href="/login"
                  className="rounded-[14px] border border-[var(--rule)] bg-[var(--card)] px-7 py-3.5 text-base font-semibold text-[var(--ink-2)] transition-all hover:border-[var(--ink-3)] hover:-translate-y-px"
                >
                  ログインする
                </Link>
              </div>
              <p className="mt-4 text-sm text-[var(--ink-4)]">
                クレジットカード不要 · 10件まで無料
              </p>
            </motion.div>

            {/* 右: アプリプレビュー（デスクトップのみ） */}
            <div className="hidden lg:block">
              <AppPreview />
            </div>
          </div>
        </section>

        {/* ── こんな経験 ── */}
        <section
          className="border-y border-[var(--rule)] py-16 lg:py-20"
          style={{ background: "var(--paper-2)" }}
        >
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-80px" }}
            transition={fadeUp.transition}
            className="mx-auto max-w-5xl px-6"
          >
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-4)] text-center"
            >
              THE PROBLEM
            </p>
            <h2
              className="mt-3 text-center text-[28px] font-black text-[var(--ink)] lg:text-[34px]"
              style={{ letterSpacing: "-0.025em" }}
            >
              こんな経験、ありませんか？
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {PROBLEMS.map(({ icon, text }) => (
                <div
                  key={text}
                  className="rounded-[var(--radius-card)] border border-[var(--rule)] bg-[var(--card)] px-5 py-5 shadow-[var(--shadow-card)]"
                >
                  <span className="text-3xl">{icon}</span>
                  <p className="mt-3 font-semibold text-[var(--ink)] leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── 使い方 ── */}
        <section className="py-16 lg:py-24">
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-80px" }}
            transition={fadeUp.transition}
            className="mx-auto max-w-5xl px-6"
          >
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-4)] text-center"
            >
              HOW IT WORKS
            </p>
            <h2
              className="mt-3 text-center text-[28px] font-black text-[var(--ink)] lg:text-[34px]"
              style={{ letterSpacing: "-0.025em" }}
            >
              3ステップで使い始める
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {HOW_STEPS.map(({ num, title, desc }) => (
                <div key={num} className="flex flex-col gap-3">
                  <span
                    className="font-mono text-[32px] font-black text-[var(--ink-4)]"
                    style={{ letterSpacing: "-0.04em" }}
                  >
                    {num}
                  </span>
                  <h3 className="text-base font-bold text-[var(--ink)]">{title}</h3>
                  <p className="text-sm text-[var(--ink-3)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── 料金プラン ── */}
        <section
          className="border-y border-[var(--rule)] py-16 lg:py-24"
          style={{ background: "var(--paper-2)" }}
        >
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-80px" }}
            transition={fadeUp.transition}
            className="mx-auto max-w-5xl px-6"
          >
            <p
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-4)] text-center"
            >
              PRICING
            </p>
            <h2
              className="mt-3 text-center text-[28px] font-black text-[var(--ink)] lg:text-[34px]"
              style={{ letterSpacing: "-0.025em" }}
            >
              シンプルな料金プラン
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 sm:max-w-2xl sm:mx-auto">
              {/* Free */}
              <div className="rounded-[var(--radius-card)] border border-[var(--rule)] bg-[var(--card)] p-7 shadow-[var(--shadow-card)]">
                <p
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-4)]"
                >
                  FREE
                </p>
                <p
                  className="mt-2 text-[38px] font-black text-[var(--ink)]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  ¥0
                  <span className="text-base font-normal text-[var(--ink-4)]">/月</span>
                </p>
                <p className="mt-0.5 text-sm text-[var(--ink-4)]">ずっと無料</p>
                <ul className="mt-6 space-y-2.5">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--ink-2)]">
                      <span className="mt-0.5 text-[var(--s-done)] font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="mt-7 block rounded-[12px] border border-[var(--rule)] px-4 py-3 text-center text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] hover:bg-[var(--paper-2)]"
                >
                  無料ではじめる
                </Link>
              </div>

              {/* Pro */}
              <div
                className="rounded-[var(--radius-card)] p-7 text-white relative overflow-hidden"
                style={{
                  background: "var(--ink)",
                  boxShadow: "var(--shadow-pop)",
                }}
              >
                <span
                  className="pointer-events-none absolute right-[-20px] bottom-[-50px] select-none leading-none font-black"
                  style={{
                    color: "rgba(255,255,255,0.05)",
                    fontFamily: '"Noto Sans JP", serif',
                    fontSize: 160,
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  〆
                </span>
                <div className="flex items-center justify-between">
                  <p
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60"
                  >
                    PRO
                  </p>
                  <span className="rounded-full bg-brand/30 px-2.5 py-0.5 text-[11px] font-semibold text-brand-light">
                    おすすめ
                  </span>
                </div>
                <p
                  className="mt-2 text-[38px] font-black"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  ¥980
                  <span className="text-base font-normal text-white/50">/月</span>
                </p>
                <p className="mt-0.5 text-sm text-white/50">税込</p>
                <ul className="mt-6 space-y-2.5">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                      <span className="mt-0.5 font-bold text-brand-light">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className="relative z-10 mt-7 block rounded-[12px] bg-brand px-4 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-brand-hover"
                >
                  Pro ではじめる
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 lg:py-28">
          <motion.div
            initial={fadeUp.initial}
            whileInView={fadeUp.animate}
            viewport={{ once: true, margin: "-80px" }}
            transition={fadeUp.transition}
            className="mx-auto max-w-xl px-6 text-center"
          >
            <h2
              className="text-[28px] font-black text-[var(--ink)] lg:text-[34px]"
              style={{ letterSpacing: "-0.025em" }}
            >
              まず無料で試してみる
            </h2>
            <p className="mt-4 text-[var(--ink-3)]">
              登録はメールアドレスだけ。30秒ではじめられます。
            </p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-[14px] bg-[var(--ink)] px-10 py-4 text-base font-bold text-[var(--paper)] transition-all hover:bg-brand hover:-translate-y-px"
              style={{ boxShadow: "0 12px 32px -8px rgba(15,13,26,0.4)" }}
            >
              無料登録はこちら →
            </Link>
          </motion.div>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t border-[var(--rule)] bg-[var(--paper-2)] py-6 text-center text-xs text-[var(--ink-4)]">
        <nav className="space-x-4">
          <Link href="/terms" className="hover:text-[var(--ink-2)] hover:underline">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-[var(--ink-2)] hover:underline">
            プライバシーポリシー
          </Link>
          <Link href="/legal" className="hover:text-[var(--ink-2)] hover:underline">
            特定商取引法に基づく表記
          </Link>
          <a href="mailto:support@shimetra.com" className="hover:text-[var(--ink-2)] hover:underline">
            お問い合わせ
          </a>
        </nav>
        <p className="mt-3">© 2026 〆トラ</p>
      </footer>
    </div>
  );
}

function AppPreview() {
  return (
    <div
      className="rounded-[22px] p-5 shadow-[var(--shadow-pop)] relative overflow-hidden"
      style={{ background: "var(--ink)" }}
    >
      {/* 装飾 */}
      <span
        className="pointer-events-none absolute select-none leading-none font-black"
        style={{
          color: "rgba(255,255,255,0.04)",
          fontFamily: '"Noto Sans JP", serif',
          fontSize: 180,
          right: -20,
          bottom: -56,
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        〆
      </span>

      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
        NEXT DEADLINE
      </p>
      <div className="mt-2 flex items-end gap-1">
        <span
          className="font-mono text-[52px] font-black leading-none tabular-nums text-white"
          style={{ letterSpacing: "-0.04em" }}
        >
          3
        </span>
        <span className="mb-1 text-lg font-semibold text-white/70">日</span>
      </div>
      <p className="mt-2 font-semibold text-white/80">株式会社テクノロジー</p>
      <span className="mt-1 inline-block rounded-full bg-[#e9defb] px-2 py-0.5 text-[11px] font-semibold text-[#5b3a93]">
        ES
      </span>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-[78%] origin-left rounded-full bg-white/80" />
      </div>

      {/* ミニカード一覧 */}
      <div className="mt-5 space-y-2.5">
        {[
          { company: "〇〇商事", kind: "説明会", days: 7, klass: "bg-[#d8eef0] text-[#1f6168]" },
          { company: "△△銀行", kind: "面接", days: 14, klass: "bg-[#fde0c8] text-[#a04316]" },
        ].map(({ company, kind, days, klass }) => (
          <div
            key={company}
            className="flex items-center gap-3 rounded-[14px] border border-white/8 bg-white/8 p-3"
          >
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white/10">
              <span className="font-mono text-sm font-bold text-white tabular-nums">{days}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{company}</p>
              <span className={`mt-0.5 inline-block rounded-[4px] px-1.5 py-0.5 text-[10px] font-bold ${klass}`}>
                {kind}
              </span>
            </div>
            <span className="shrink-0 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/60">
              未対応
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
