import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "ログイン | 〆トラ",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] flex flex-col lg:flex-row">
      {/* ── 左カラム（PC では brand 紹介） ── */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between bg-[var(--ink)] text-white px-12 py-14 relative overflow-hidden">
        {/* 装飾 〆 */}
        <span
          className="pointer-events-none select-none absolute right-[-40px] bottom-[-80px] text-[320px] font-black leading-none"
          style={{ color: "rgba(255,255,255,0.04)", fontFamily: '"Noto Sans JP", serif' }}
          aria-hidden="true"
        >
          〆
        </span>

        {/* ロゴ */}
        <div className="flex items-center gap-2.5">
          <span
            className="brand-seal relative inline-flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-white text-[var(--ink)]"
            style={{
              fontFamily: '"Noto Sans JP", serif',
              fontWeight: 900,
              fontSize: 20,
              transform: "rotate(-4deg)",
            }}
            aria-hidden="true"
          >
            〆
          </span>
          <span className="text-[18px] font-extrabold text-white" style={{ letterSpacing: "-0.02em" }}>
            トラ
          </span>
        </div>

        {/* キャッチコピー */}
        <div className="mt-auto mb-auto space-y-5 relative z-10">
          <h1
            className="text-[38px] font-black leading-tight"
            style={{ letterSpacing: "-0.035em" }}
          >
            アプリに登録して、<br />就活の締切を<br />管理。
          </h1>
          <p className="text-[var(--ink-4)] text-base leading-relaxed max-w-[280px]">
            ES・説明会・面接の締切を一元管理し、<br />
            締切前にメールで通知します。
          </p>
          <ul className="space-y-2 text-sm">
            {[
              "締切72時間前・24時間前・3時間前に通知",
              "クレジットカード不要で10件まで無料",
              "メールアドレスだけで30秒登録",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-white/70">
                <span className="text-brand font-bold">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── 右カラム（フォーム） ── */}
      <div className="flex flex-1 flex-col px-6 py-10 lg:px-14 lg:py-14 lg:max-w-[480px]">
        {/* big-seal */}
        <div className="mb-8">
          <div
            className="big-seal relative inline-flex h-[88px] w-[88px] items-center justify-center rounded-[22px] bg-[var(--ink)] text-white"
            style={{
              fontFamily: '"Noto Sans JP", serif',
              fontWeight: 900,
              fontSize: 52,
              letterSpacing: "-0.04em",
              transform: "rotate(-3deg)",
            }}
          >
            〆
          </div>
        </div>

        <h1
          className="text-[30px] font-black text-[var(--ink)] leading-tight"
          style={{ letterSpacing: "-0.035em" }}
        >
          メールアドレスを登録。
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-3)]">
          入力されたメールアドレスにログインリンクを送信します。
        </p>

        <div className="mt-8">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-auto pt-10 text-xs text-[var(--ink-4)] text-center">
          ログインすることで
          <a href="/terms" className="underline hover:text-[var(--ink-2)]">利用規約</a>
          ・
          <a href="/privacy" className="underline hover:text-[var(--ink-2)]">プライバシーポリシー</a>
          に同意したものとみなします。
        </p>
      </div>
    </main>
  );
}
