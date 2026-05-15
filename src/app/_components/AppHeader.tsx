"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AppHeaderProps {
  email: string;
}

export function AppHeader({ email }: AppHeaderProps) {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <>
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

          {/* ログアウトボタン */}
          <button
            onClick={() => setLogoutOpen(true)}
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
      </header>

      {/* ログアウト確認ダイアログ */}
      {logoutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setLogoutOpen(false)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-2xl border border-[var(--rule)] bg-[var(--paper)] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-[var(--ink)]">
              ログアウトしますか？
            </h2>
            <p className="mt-2 text-sm text-[var(--ink-2)]">
              ログアウトしても登録した締め切りは保持されます。
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setLogoutOpen(false)}
                className="rounded-xl border border-[var(--rule)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--ink-2)] transition-all hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
              >
                キャンセル
              </button>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition-all hover:-translate-y-px hover:opacity-90"
              >
                ログアウトする
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
