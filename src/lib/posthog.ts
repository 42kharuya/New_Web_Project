/**
 * src/lib/posthog.ts
 *
 * PostHog クライアント初期化
 *
 * - クライアントサイド: posthog-js（ブラウザ用）
 * - サーバーサイド: posthog-node（Route Handler 用、シングルトン）
 *
 * 環境変数:
 *  NEXT_PUBLIC_POSTHOG_KEY : PostHog プロジェクト API キー（必須）
 *  NEXT_PUBLIC_POSTHOG_HOST: PostHog ホスト URL（デフォルト: https://app.posthog.com）
 */

// ── クライアントサイド（posthog-js） ─────────────────────────────────────────

export { default as posthogClient } from "posthog-js";

// ── サーバーサイド（posthog-node）シングルトン ────────────────────────────────

import { PostHog } from "posthog-node";

let _serverPostHog: PostHog | null = null;

/**
 * サーバーサイド用 PostHog クライアントを返す（シングルトン）。
 * NEXT_PUBLIC_POSTHOG_KEY が未設定の場合は null を返す。
 *
 * Route Handler または Server Action 内でのみ呼び出すこと。
 */
export function getServerPostHog(): PostHog | null {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return null;

  if (!_serverPostHog) {
    _serverPostHog = new PostHog(apiKey, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      // サーバーサイドは手動フラッシュ制御のためバッチ送信無効
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return _serverPostHog;
}
