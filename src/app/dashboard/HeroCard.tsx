"use client";

import { useEffect, useState } from "react";
import { KIND_LABEL } from "@/features/deadlines/format";
import type { DeadlineItem } from "./DeadlineList";

function timeLeft(iso: string): {
  hours: number;
  minutes: number;
  seconds: number;
  overdue: boolean;
  progress: number;
} {
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs < 0) return { hours: 0, minutes: 0, seconds: 0, overdue: true, progress: 1 };
  const totalSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const days = Math.floor(totalSec / 86400);
  const progress = Math.max(0.06, Math.min(1, (14 - days) / 14));
  return { hours, minutes, seconds, overdue: false, progress };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function HeroCard({ item }: { item: DeadlineItem }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1_000);
    return () => clearInterval(t);
  }, []);

  const { hours, minutes, seconds, overdue, progress } = timeLeft(item.deadlineAt);

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

      {/* 「次の締め切りまで」ラベル */}
      <p
        className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60"
      >
        次の締め切りまで
      </p>

      {/* カウントダウン */}
      <div className="mt-2 flex items-end gap-1.5">
        <span
          className="font-mono tabular-nums leading-none"
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: overdue ? "var(--u-overdue)" : "white",
          }}
        >
          {pad(hours)}
        </span>
        <span className="mb-1.5 text-base font-semibold opacity-70">h</span>
        <span
          className="font-mono tabular-nums leading-none"
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: overdue ? "var(--u-overdue)" : "white",
          }}
        >
          {pad(minutes)}
        </span>
        <span className="mb-1.5 text-base font-semibold opacity-70">m</span>
        <span
          className="font-mono tabular-nums leading-none"
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: overdue ? "var(--u-overdue)" : "white",
          }}
        >
          {pad(seconds)}
        </span>
        <span className="mb-1.5 text-base font-semibold opacity-70">s</span>
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
