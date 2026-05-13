"use client";

import { useEffect, useState } from "react";

export function NotificationToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="flex items-start gap-3 rounded-[18px] border border-[var(--rule)] bg-[var(--card)] p-3 shadow-[var(--shadow-pop)]"
      style={{ animation: "slide-in-down 0.35s ease both" }}
    >
      {/* アプリアイコン */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-[var(--ink)] text-white"
        style={{
          fontFamily: '"Noto Sans JP", serif',
          fontWeight: 900,
          fontSize: 18,
        }}
        aria-hidden="true"
      >
        〆
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-[var(--ink-3)]">〆トラ · 通知</p>
        <p className="mt-0.5 text-sm font-medium text-[var(--ink)] leading-snug">
          ⏰ 明日 9:00 締切 — 〇〇商事 ES
        </p>
        <p className="mt-0.5 text-[11px] text-[var(--ink-4)]">たった今</p>
      </div>
    </div>
  );
}
