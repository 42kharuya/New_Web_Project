# Runbook — 〆トラ

運用・障害対応・ロールバックの手順書。

## 1. 守るべき最重要導線

| 優先度 | 導線                                        | 壊れたときの影響             |
| ------ | ------------------------------------------- | ---------------------------- |
| 🔴 S1  | ログイン（マジックリンク → セッション発行） | 全ユーザーがアクセス不能     |
| 🔴 S1  | Stripe Webhook（`/api/stripe/webhook`）     | 課金状態が DB に反映されない |
| 🔴 S1  | 通知 Cron（`/api/cron/notify`）             | 締切前メールが届かない       |
| 🟡 S2  | 締切 CRUD（`/api/deadlines`）               | コア体験が使えない           |
| 🟡 S2  | Stripe Checkout（`/api/stripe/checkout`）   | アップグレードができない     |

## 2. ログの確認場所

| 何を調べるか                          | どこを見るか                                                            |
| ------------------------------------- | ----------------------------------------------------------------------- |
| API / Cron / Webhook のリクエストログ | Cloudflare Dashboard → Workers & Pages → `job-hunt-tracker` → **Logs**  |
| クライアントエラー                    | [Sentry](https://sentry.io) → Issues                                    |
| ユーザー行動・イベント                | [PostHog](https://app.posthog.com) → Events                             |
| メール送信結果                        | [Resend](https://resend.com) → Logs                                     |
| 通知の送信状態                        | DB → `notification_deliveries` テーブル（`status` = `sent` / `failed`） |
| 課金状態                              | DB → `subscriptions` テーブル ＋ Stripe Dashboard → Events              |

## 3. 障害の一次切り分け

### 🔴 ログイン（マジックリンク）が届かない

```
Resend Dashboard > Logs でメール送信状態を確認
  → failed: RESEND_API_KEY か EMAIL_FROM の設定を確認
  → delivered: スパムフォルダを確認

CF Logs で POST /api/auth/magic-link を確認
  → 500: RESEND_API_KEY / DATABASE_URL の環境変数を確認
```

### 🔴 Stripe Webhook が反映されない

```
Stripe Dashboard > Developers > Webhooks > イベント履歴を確認
  → 未送信:  エンドポイント URL と有効化状態を確認
  → 失敗:    CF Logs で POST /api/stripe/webhook を確認
               → 400: STRIPE_WEBHOOK_SECRET が正しいか確認
               → 500: DB 接続エラーの可能性

手動再送: Stripe Dashboard > Webhooks > 対象イベント > "Resend"
（subscriptions の upsert は冪等なので何度でも再送可）
```

### 🔴 通知メールが届かない

```
CF Logs で POST /api/cron/notify の実行を確認
  → 実行されていない: wrangler.toml の [triggers] crons を確認
  → 401:              CRON_SECRET（CF シークレット）を確認
  → 500:              DB 接続 / Resend エラーをログで確認

DB で notification_deliveries を確認
  → status=failed:    error カラムにエラー詳細あり
  → レコードなし:     Cron 未実行 or 抽出クエリのバグ

手動実行（冪等設計 = 再実行しても二重送信しない）:
  curl -X POST https://shimetra.com/api/cron/notify \
    -H "Authorization: Bearer <CRON_SECRET>"
```

### 🔴 全 API が 500 / DB 接続不能

```
CF Logs でエラー内容を確認
  → DATABASE_URL 関連: CF シークレットの DATABASE_URL を確認
  → migration 関連:    npm run db:migrate:deploy を本番 DB に対して実行

Neon Dashboard でDBの稼働状況を確認
```

## 4. シークレット管理

環境変数の詳細は `docs/ENV.md` を参照。ここでは**機密情報（Secrets）のみ**を扱う。

### シークレット一覧

| 変数                    | 生成方法                    | 設定場所        |
| ----------------------- | --------------------------- | --------------- |
| `AUTH_SECRET`           | `openssl rand -base64 32`   | CF シークレット |
| `CRON_SECRET`           | `openssl rand -base64 32`   | CF シークレット |
| `DATABASE_URL`          | Neon Dashboard              | CF シークレット |
| `DATABASE_URL_UNPOOLED` | Neon Dashboard              | CF シークレット |
| `RESEND_API_KEY`        | Resend Dashboard            | CF シークレット |
| `STRIPE_SECRET_KEY`     | Stripe Dashboard            | CF シークレット |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard > Webhooks | CF シークレット |

### シークレットのローテーション手順

```
1. 新しい値を生成
2. CF Dashboard → Settings → Variables and Secrets → 値を更新
3. npm run deploy（新しい値でデプロイ）
4. .env.local を更新

※ Stripe Webhook の場合: 旧エンドポイントを残したまま新エンドポイントを追加
   → 動作確認後に旧を削除（ダウンタイムなしで切り替え）
```

## 5. ロールバック手順

### コードのロールバック

```bash
git revert HEAD --no-edit
git push origin main
npm run deploy
```

### DB マイグレーションのロールバック

> 追加のみのマイグレーション（カラム追加など）はロールバック不要。
> 破壊的変更（カラム削除など）の場合のみ以下を実行。

```bash
# 1. コードを戻す（上記）
# 2. 手動 SQL でスキーマを元に戻す
# 3. Prisma のマイグレーション状態を修正
DATABASE_URL="..." npx prisma migrate resolve --rolled-back <migration_name>
```

### ロールバック後のスモークテスト

```bash
# 自動スモークテスト
npm run test:smoke

# 手動確認（必須3点）
# A. /login でマジックリンクが届く
# B. /dashboard が表示される
# C. Cron が 200 を返す
curl -X POST https://shimetra.com/api/cron/notify \
  -H "Authorization: Bearer <CRON_SECRET>"
```

## 6. 変更時のチェックリスト

### 環境変数を追加・変更したとき

| 変数の種類          | 対応箇所                                                              |
| ------------------- | --------------------------------------------------------------------- |
| 機密情報（Secrets） | CF Dashboard → Secrets を更新 → `npm run deploy`                      |
| 非機密の固定値      | `wrangler.toml [vars]` を更新 → `npm run deploy`                      |
| `NEXT_PUBLIC_` 系   | `wrangler.toml [vars]` ＋ CF ビルド設定の**両方**を更新 → Retry build |

### DB スキーマを変更したとき

```bash
# 1. ローカルでマイグレーションファイルを作成
npm run db:migrate

# 2. 本番 DB に適用
DATABASE_URL="<本番URL>" npm run db:migrate:deploy
```

### デプロイ前の最終確認

- [ ] テストが全て通る（`npm run test`）
- [ ] 本番 DB のマイグレーションが適用済み
- [ ] 追加した環境変数が CF に設定済み
