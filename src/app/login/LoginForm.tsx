"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "idle" | "loading" | "sent" | "error";

const ERROR_MESSAGES: Record<string, string> = {
  expired: "リンクが期限切れです。もう一度メールを送信してください。",
  invalid: "無効なリンクです。再度ログインしてください。",
  server: "サーバーエラーが発生しました。しばらく後にお試しください。",
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [apiError, setApiError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setApiError("");

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        const data = await res.json().catch(() => ({}));
        setApiError(data.error ?? "送信に失敗しました");
        setStatus("error");
      }
    } catch {
      setApiError("ネットワークエラーが発生しました");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4">
      {urlError && ERROR_MESSAGES[urlError] && (
        <p className="rounded-xl bg-[var(--u-overdue-bg)] px-4 py-2.5 text-sm text-[var(--u-overdue)]">
          {ERROR_MESSAGES[urlError]}
        </p>
      )}

      {status === "sent" ? (
        <div className="rounded-[var(--radius-card)] border border-[var(--rule)] bg-[var(--card)] px-5 py-5">
          <p className="text-base font-bold text-[var(--ink)]">メールを送信しました</p>
          <p className="mt-2 text-sm text-[var(--ink-2)]">
            <span className="font-mono text-xs">{email}</span>{" "}
            宛にログインリンクを送りました。
          </p>
          <p className="mt-1.5 text-xs text-[var(--ink-3)]">
            リンクの有効期限は 30 分です。届かない場合は迷惑メールをご確認ください。
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setEmail("");
            }}
            className="mt-3 text-xs text-[var(--ink-3)] underline hover:text-[var(--ink-2)]"
          >
            別のアドレスで送り直す
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* input-shell */}
          <div
            className="flex items-center rounded-[14px] border-[1.5px] border-[var(--rule)] bg-[var(--card)] px-3.5 transition-all focus-within:border-brand focus-within:shadow-[0_0_0_4px_#eef2ff]"
          >
            <span className="pointer-events-none shrink-0 text-[var(--ink-3)]">
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
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              id="email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 border-none bg-transparent px-3 py-3.5 text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-4)]"
            />
          </div>

          {status === "error" && (
            <p className="rounded-xl bg-[var(--u-overdue-bg)] px-3 py-2 text-sm text-[var(--u-overdue)]">
              {apiError}
            </p>
          )}

          {/* btn-primary */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--ink)] px-4 py-[15px] text-[15px] font-bold text-[var(--paper)] transition-all hover:bg-brand disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                送信中…
              </>
            ) : (
              "マジックリンクを送信"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
