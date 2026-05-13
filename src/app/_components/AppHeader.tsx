"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppHeaderProps {
  email: string;
}

export function AppHeader({ email }: AppHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <header
      className="sticky top-0 z-30 border-b border-[var(--rule)]"
      style={{
        background: "color-mix(in oklab, var(--paper) 88%, transparent)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-2.5">
        {/* ブランドマーク */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[var(--ink)] hover:opacity-80 transition-opacity"
          style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          <span
            className="brand-seal relative inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--ink)] text-white"
            style={{
              fontFamily: '"Noto Sans JP", serif',
              fontWeight: 900,
              fontSize: 18,
              transform: "rotate(-4deg)",
            }}
            aria-hidden="true"
          >
            〆
          </span>
          <span style={{ fontSize: 17 }}>トラ</span>
        </Link>

        {/* 右側アイコンボタン群 */}
        <div className="flex items-center gap-1.5">
          {/* 検索 */}
          <button
            className="relative inline-flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border border-[var(--rule)] bg-[var(--card)] text-[var(--ink-2)] transition-all hover:-translate-y-px hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
            aria-label="検索"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>

          {/* 通知ベル */}
          <button
            className="relative inline-flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border border-[var(--rule)] bg-[var(--card)] text-[var(--ink-2)] transition-all hover:-translate-y-px hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
            aria-label="通知"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          {/* ログアウト */}
          <button
            onClick={handleLogout}
            className="relative inline-flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border border-[var(--rule)] bg-[var(--card)] text-[var(--ink-2)] transition-all hover:-translate-y-px hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
            aria-label={`ログアウト (${email})`}
            title={`ログアウト（${email}）`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
