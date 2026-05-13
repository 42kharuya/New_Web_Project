"use client";

import { useEffect, useState } from "react";
import { KIND_LABEL } from "@/features/deadlines/format";
import type { DeadlineItem } from "./DeadlineList";

const GREETINGS = [
  [5, 12, "GOOD MORNING"],
  [12, 17, "GOOD AFTERNOON"],
  [17, 22, "GOOD EVENING"],
  [22, 24, "GOOD NIGHT"],
  [0, 5, "GOOD NIGHT"],
] as const;

function greeting(h: number) {
  return GREETINGS.find(([s, e]) => h >= s && h < e)?.[2] ?? "HELLO";
}

function timeLeft(iso: string): {
  value: number;
  unit: string;
  overdue: boolean;
  progress: number;
} {
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs < 0) return { value: 0, unit: "期限切れ", overdue: true, progress: 1 };
  const hours = diffMs / (1000 * 60 * 60);
  const days = Math.floor(hours / 24);
  const progress = Math.max(0.06, Math.min(1, (14 - days) / 14));
  if (days > 0) return { value: days, unit: "日", overdue: false, progress };
  return { value: Math.ceil(hours), unit: "時間", overdue: false, progress };
}

export function HeroCard({ item }: { item: DeadlineItem }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const h = now.getHours();
  const greet = greeting(h);
  const dateLabel = now.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const { value, unit, overdue, progress } = timeLeft(item.deadlineAt);

  return (
    <div
      className="relative overflow-hidden rounded-[22px] px-6 py-5 text-white"
      style={{
        background: "var(--ink)",
        boxShadow: "var(--shadow-pop)",
        animation: "pop-in 0.4s ease both",
      }}
    >
      {/* 装飾 〆 */}
      <span
        className="pointer-events-none absolute select-none leading-none font-black"
        style={{
          color: "rgba(255,255,255,0.06)",
          fontFamily: '"Noto Sans JP", serif',
          fontSize: 220,
          right: -22,
          bottom: -56,
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        〆
      </span>

      {/* パルスドット */}
      <div
        className="absolute right-5 top-5 h-2 w-2 rounded-full bg-white"
        style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
        aria-hidden="true"
      />

      {/* グリーティング */}
      <p
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60"
      >
        {greet} · {dateLabel}
      </p>

      {/* カウントダウン */}
      <div className="mt-2 flex items-end gap-1">
        <span
          className="font-mono leading-none tabular-nums"
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: overdue ? "var(--u-overdue)" : "white",
          }}
        >
          {value}
        </span>
        <span className="mb-1.5 text-lg font-semibold opacity-80">{unit}</span>
      </div>

      {/* 企業名・種別 */}
      <p className="mt-3 truncate font-semibold opacity-90">{item.companyName}</p>
      <span
        className={`kind-${item.kind} mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold`}
      >
        {KIND_LABEL[item.kind]}
      </span>

      {/* プログレスバー（drawProg アニメーション） */}
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full origin-left rounded-full bg-white/80"
          style={
            {
              animation: "draw-prog 1.1s cubic-bezier(.2,.8,.2,1) both",
              "--p": progress,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
