/**
 * Cloudflare Workers エントリーポイント
 *
 * opennextjs-cloudflare が生成した worker.js をラップし、
 * Cron Trigger 用の scheduled ハンドラを追加する。
 *
 * [triggers]
 * crons = ["*\/10 * * * *"]   → 10 分ごとに scheduled() を呼び出す
 *
 * scheduled() は APP_URL/api/cron/notify へ POST し、通知メールを送信する。
 */

export * from "./.open-next/worker.js";

import nextWorker from "./.open-next/worker.js";

const worker = {
  ...nextWorker,

  async scheduled(
    _event: { scheduledTime: number; cron: string },
    env: { APP_URL: string; CRON_SECRET: string },
    ctx: { waitUntil: (promise: Promise<unknown>) => void },
  ): Promise<void> {
    ctx.waitUntil(
      fetch(`${env.APP_URL}/api/cron/notify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.CRON_SECRET}` },
      })
        .then(async (res) => {
          const body = await res.text();
          console.log("[scheduled] cron/notify:", res.status, body);
        })
        .catch((err: unknown) => {
          console.error(
            "[scheduled] cron/notify failed:",
            err instanceof Error ? err.message : String(err),
          );
        }),
    );
  },
};

export default worker;
