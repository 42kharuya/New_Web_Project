import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,
  replaysOnErrorSampleRate: process.env.NODE_ENV === "production" ? 1.0 : 0,
  replaysSessionSampleRate: 0,
  integrations: [
    Sentry.replayIntegration(),
  ],
  enabled: process.env.NODE_ENV === "production",
});
