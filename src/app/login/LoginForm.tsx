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
    <div className="mt-6">
      {/* URL のエラークエリ（expired / invalid / server） */}
      {urlError && ERROR_MESSAGES[urlError] && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {ERROR_MESSAGES[urlError]}
        </p>
      )}

      {status === "sent" ? (
        <div className="rounded-lg bg-green-50 px-4 py-4 text-sm text-green-800">
          <p className="font-semibold">メールを送信しました 📬</p>
          <p className="mt-1">
            <span className="font-mono text-xs">{email}</span>{" "}
            宛にログインリンクを送りました。
          </p>
          <p className="mt-2 text-xs text-green-700">
            リンクの有効期限は 30 分です。届かない場合は迷惑メールをご確認ください。
          </p>
          <button
            onClick={() => {
              setStatus("idle");
              setEmail("");
            }}
            className="mt-3 text-xs text-green-700 underline"
          >
            別のアドレスで送り直す
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--ink-2)]"
            >
              メールアドレス
            </label>
            <div className="relative mt-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--ink-3)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                className="block w-full rounded-lg border border-[var(--rule)] bg-white pl-9 pr-3 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>

          {status === "error" && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white hover:bg-brand transition-colors disabled:opacity-60"
          >
            {status === "loading" ? "送信中…" : "マジックリンクを送信"}
          </button>
        </form>
      )}
    </div>
  );
}
