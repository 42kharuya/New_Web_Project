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
      style={{ animation: "slide-in-down 0.35s ease both" }}
      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg shadow-black/10"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white text-lg font-black">
        〆
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[var(--ink-3)]">〆トラ</p>
        <p className="text-sm font-medium text-[var(--ink)] truncate">
          ⏰ 明日 9:00 締切 — 〇〇商事 ES
        </p>
      </div>
    </div>
  );
}
