"use client";

/**
 * PostHogProvider — クライアントサイド PostHog 初期化 & ページビュー計測
 *
 * - posthog-js を初期化し、子コンポーネントを PostHogProvider でラップする
 * - NEXT_PUBLIC_POSTHOG_KEY 未設定時は何もしない（開発環境向け）
 * - Next.js App Router の SPA ナビゲーションに対応したページビュー計測
 *   （capture_pageview: false にして usePathname / useSearchParams で手動 capture）
 */

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// ── ページビュー計測（SPA ナビゲーション対応） ─────────────────────────────────

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (posthog.__loaded) {
      posthog.capture("$pageview", { $current_url: window.location.href });
    }
  }, [pathname, searchParams]);

  return null;
}

// ── Provider 本体 ─────────────────────────────────────────────────────────────

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  // API キー未設定時は素通り（開発環境での意図しない計測を防ぐ）
  if (!apiKey) {
    return <>{children}</>;
  }

  // posthog-js 初期化（二重初期化防止は posthog-js 側で保証される）
  if (typeof window !== "undefined" && !posthog.__loaded) {
    posthog.init(apiKey, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      // SPA ナビゲーションは PageViewTracker で手動 capture するため無効化
      capture_pageview: false,
      // ページ離脱イベントは自動計測
      capture_pageleave: true,
    });
  }

  return (
    <PHProvider client={posthog}>
      <PageViewTracker />
      {children}
    </PHProvider>
  );
}
