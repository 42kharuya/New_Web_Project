"use client";

import { useEffect, useState } from "react";
import { KIND_LABEL } from "@/features/deadlines/format";
import type { DeadlineItem } from "./DeadlineList";

const GREETINGS = [
  [5, 11, "GOOD MORNING"],
  [11, 17, "GOOD AFTERNOON"],
  [17, 22, "GOOD EVENING"],
  [22, 24, "GOOD NIGHT"],
  [0, 5, "GOOD NIGHT"],
] as const;

function greeting(h: number) {
  return (
    GREETINGS.find(([s, e]) => h >= s && h < e)?.[2] ?? "HELLO"
  );
}

function timeLeft(iso: string) {
  const diffMs = new Date(iso).getTime() - Date.now();
  if (diffMs < 0) return { value: 0, unit: "期限切れ", overdue: true, progress: 1 };
  const hours = diffMs / (1000 * 60 * 60);
  const days = Math.floor(hours / 24);
  const progress = Math.min(1, Math.max(0, (14 - days) / 14));
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
      className="relative overflow-hidden rounded-[var(--radius-card)] p-6 text-white shadow-[var(--shadow-pop)]"
      style={{
        background: "var(--ink)",
        animation: "pop-in 0.4s ease both",
      }}
    >
      {/* 装飾 〆 */}
      <span
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-[120px] font-black leading-none"
        style={{ color: "rgba(246,244,255,0.06)" }}
        aria-hidden="true"
      >
        〆
      </span>

      {/* パルスドット */}
      <div
        className="absolute right-4 top-4 h-2 w-2 rounded-full bg-white"
        style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
        aria-hidden="true"
      />

      {/* 挨拶 */}
      <p className="text-xs font-semibold uppercase tracking-widest opacity-60">
        {greet} · {dateLabel}
      </p>

      {/* カウントダウン */}
      <div className="mt-2 flex items-end gap-1">
        <span
          className="font-mono text-6xl font-black leading-none tabular-nums"
          style={{ color: overdue ? "var(--u-overdue)" : "white" }}
        >
          {value}
        </span>
        <span className="mb-1 text-lg font-semibold opacity-80">{unit}</span>
      </div>

      {/* 企業名・種別 */}
      <p className="mt-3 truncate font-semibold opacity-90">{item.companyName}</p>
      <span
        className={`kind-${item.kind} mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold`}
      >
        {KIND_LABEL[item.kind]}
      </span>

      {/* プログレスバー */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white/80"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
