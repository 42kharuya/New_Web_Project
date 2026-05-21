# 環境変数ガイド（〆トラ）

## 変数一覧

| 変数名                                        | 本番環境                        | ローカル環境 | CI環境             |
| --------------------------------------------- | ------------------------------- | ------------ | ------------------ |
| `ANALYTICS_PROVIDER`（非機密の固定値）        | `wrangler.toml`                 | `.env.local` | —                  |
| `SENTRY_ORG`（非機密の固定値）                | `wrangler.toml`                 | `.env.local` | —                  |
| `SENTRY_PROJECT`（非機密の固定値）            | `wrangler.toml`                 | `.env.local` | —                  |
| `APP_ENV`（非機密の固定値）                   | `wrangler.toml`                 | `.env.local` | —                  |
| `EMAIL_PROVIDER`（非機密の固定値）            | `wrangler.toml`                 | `.env.local` | —                  |
| `MAGIC_LINK_EXPIRY_MINUTES`（非機密の固定値） | `wrangler.toml`                 | `.env.local` | —                  |
| `APP_URL`（非機密の固定値）                   | `wrangler.toml`                 | `.env.local` | —                  |
| `EMAIL_FROM`（非機密の固定値）                | `wrangler.toml`                 | `.env.local` | —                  |
| `STRIPE_PRICE_ID`（非機密の固定値）           | `wrangler.toml`                 | `.env.local` | `ci.yml`（ダミー） |
| `DATABASE_URL`（機密情報）                    | CF シークレット                 | `.env.local` | `ci.yml`（ダミー） |
| `DATABASE_URL_UNPOOLED`（機密情報）           | CF シークレット                 | `.env.local` | —                  |
| `AUTH_SECRET`（機密情報）                     | CF シークレット                 | `.env.local` | `ci.yml`（ダミー） |
| `RESEND_API_KEY`（機密情報）                  | CF シークレット                 | `.env.local` | —                  |
| `STRIPE_SECRET_KEY`（機密情報）               | CF シークレット                 | `.env.local` | `ci.yml`（ダミー） |
| `STRIPE_WEBHOOK_SECRET`（機密情報）           | CF シークレット                 | `.env.local` | `ci.yml`（ダミー） |
| `CRON_SECRET`（機密情報）                     | CF シークレット                 | `.env.local` | `ci.yml`（ダミー） |
| `UPSTASH_REDIS_REST_URL`（機密情報）          | CF シークレット                 | `.env.local` | —                  |
| `UPSTASH_REDIS_REST_TOKEN`（機密情報）        | CF シークレット                 | `.env.local` | —                  |
| `NEXT_PUBLIC_POSTHOG_KEY`                     | `wrangler.toml` + CF ビルド設定 | `.env.local` | —                  |
| `NEXT_PUBLIC_POSTHOG_HOST`                    | `wrangler.toml` + CF ビルド設定 | `.env.local` | —                  |
| `NEXT_PUBLIC_SENTRY_DSN`                      | `wrangler.toml` + CF ビルド設定 | `.env.local` | —                  |

**凡例**

- `CF シークレット` = Cloudflare ダッシュボード → Settings → Variables and Secrets（暗号化）
- `CF ビルド設定` = Cloudflare ダッシュボード → Settings → Build → Variables and Secrets
- `wrangler.toml` = リポジトリの `wrangler.toml [vars]`（コードで管理）
- `ci.yml`（ダミー） = `.github/workflows/ci.yml` の `env:` ブロックにダミー値を直書き
- `—` = 設定不要

---

## NEXT*PUBLIC* 変数の注意事項

### なぜ2か所に設定するのか

```
【ブラウザ用】CF ビルド設定
  → next build 時に値がJSファイルへ直接書き込まれる
  → ブラウザに届くJSの中に値が含まれる

【サーバー用】wrangler.toml
  → Cloudflare Workers 実行時に process.env から読まれる
  → サーバー側コード（getServerPostHog() など）で使われる
```

Vercel では1か所の設定で両方に届くが、Cloudflare Workers では構造上2か所への設定が必要。

### 変更時の手順

`NEXT_PUBLIC_` 変数を追加・変更する場合は以下の **3か所すべて** を更新する。

1. `wrangler.toml [vars]` を編集
2. CF ダッシュボード → ビルド設定 → 変数とシークレット を更新
3. PR マージ後、CF ダッシュボードから **Retry build** を実行

> **注意**: ビルド設定の変更は Retry build を実行しないと反映されない。
> 通常のデプロイ（コードの push）だけでは不十分。
