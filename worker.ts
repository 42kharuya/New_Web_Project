import { withSentry } from "@sentry/cloudflare";
import nextWorker from "./.open-next/worker.js";

export * from "./.open-next/worker.js";

type Env = {
  APP_URL: string;
  CRON_SECRET: string;
  NEXT_PUBLIC_SENTRY_DSN?: string;
};

export default withSentry(
  (env: Env) => ({
    dsn: env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
  }),
  {
    ...nextWorker,

    async scheduled(
      _event: { scheduledTime: number; cron: string },
      env: Env,
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
  },
);
