# ARCHITECTURE.md — 〆トラ システム設計

> 現行コードを正として記述。仕様は `docs/PRD.md`、環境変数は `docs/ENV.md` を参照。

---

## 1. 全体構成

```
ブラウザ
  └── Next.js 15 (App Router) on Cloudflare Workers
        ├── Middleware (Edge)       — 認証ガード
        ├── Server Components       — 画面描画
        ├── Route Handlers          — API
        ├── Prisma → Neon           — PostgreSQL
        ├── Stripe                  — サブスク課金
        ├── Resend                  — メール送信
        ├── PostHog                 — アクセス解析
        ├── Sentry                  — エラー監視
        └── Cloudflare Cron → /api/cron/notify
```

| レイヤー | 技術 | 役割 |
|---|---|---|
| ホスティング | Cloudflare Workers + `@opennextjs/cloudflare` | Next.js をエッジで実行 |
| フレームワーク | Next.js 15 (App Router) | UI・SSR・API Routes |
| DB | PostgreSQL (Neon) | データ永続化 |
| 認証 | マジックリンク + JWT Cookie | パスワードレス認証 |
| 課金 | Stripe サブスク | Free / Pro プラン管理 |
| メール | Resend（ローカルは `console`） | マジックリンク・通知メール |
| 解析 | PostHog | ページビュー・イベント計測 |
| 監視 | Sentry | クライアントエラー捕捉 |
| レート制限 | Upstash Redis | マジックリンク送信の過剰リクエスト防止 |
| Cron | Cloudflare Cron Triggers（`*/10 * * * *`） | 締切通知の定期バッチ |

---

## 2. ディレクトリ構成

```
src/
├── middleware.ts               # 認証ガード（Edge Runtime）
├── app/
│   ├── page.tsx                # LP（トップ）
│   ├── login/                  # ログイン画面
│   ├── dashboard/              # 締切一覧（保護）
│   ├── deadline/
│   │   ├── new/                # 締切登録フォーム（保護）
│   │   └── [id]/               # 締切詳細・編集（保護）
│   ├── billing/                # プラン・課金管理（保護）
│   ├── legal/ terms/ privacy/  # 法的ページ
│   ├── _components/            # LP・共通コンポーネント
│   └── api/
│       ├── auth/magic-link/    # マジックリンク発行
│       ├── auth/verify/        # トークン検証 → セッション発行
│       ├── auth/logout/        # ログアウト（Cookie 削除）
│       ├── deadlines/          # 締切 CRUD
│       ├── stripe/checkout/    # チェックアウトセッション作成
│       ├── stripe/portal/      # カスタマーポータル
│       ├── stripe/webhook/     # Stripe Webhook 受信
│       └── cron/notify/        # 通知 Cron エンドポイント
├── config/
│   └── plans.ts                # プラン定数（FREE_ITEM_LIMIT など）
├── features/
│   ├── analytics/              # PostHog イベント送信
│   ├── auth/
│   │   ├── session.ts          # JWT セッション（jose / Edge 対応）
│   │   └── token.ts            # マジックリンクトークン生成・検証
│   ├── billing/
│   │   └── webhook.ts          # Stripe Webhook ハンドラ
│   ├── deadlines/
│   │   ├── format.ts           # 締切日時フォーマット
│   │   ├── gate.ts             # Pro 判定 / Free 制限チェック
│   │   └── validate.ts         # 入力バリデーション
│   └── notifications/
│       └── notify.ts           # 通知 Cron コアロジック
└── lib/
    ├── env.ts                  # 環境変数一元管理（Zod バリデーション）
    ├── api.ts                  # Route Handler 共通ユーティリティ
    ├── auth.ts                 # 認証共通ヘルパー
    ├── posthog.ts              # PostHog クライアント（サーバー用シングルトン）
    ├── prisma.ts               # PrismaClient シングルトン
    ├── ratelimit.ts            # Upstash レートリミッター
    ├── stripe.ts               # Stripe クライアント
    ├── motion.ts               # アニメーション定数
    └── mailer/                 # メール送信抽象層（console / resend）
```

---

## 3. 認証フロー（マジックリンク）

```
[1] ユーザーがメールアドレスを入力
      ↓
[2] POST /api/auth/magic-link
      - Upstash でレート制限（5回/10分）
      - generateToken() → MagicLinkToken を DB 保存（有効期限 30分）
      - Resend でマジックリンクメール送信
      ↓
[3] ユーザーがメール内リンクをクリック
      GET /api/auth/verify?token=<hex>
      ↓
[4] consumeMagicLinkToken()
      - token 検証 → email 取得
      - user が存在しなければ upsert（初回登録）
      - createSessionToken() → JWT を httpOnly Cookie へセット
      ↓
[5] /dashboard へリダイレクト
```

**セッション仕様**

| 項目 | 値 |
|---|---|
| 保存場所 | httpOnly Cookie（`__session`） |
| アルゴリズム | HS256 JWT（jose） |
| 有効期限 | 30日 |
| 署名キー | `AUTH_SECRET` 環境変数 |
| DB アクセス | Middleware では不要（署名検証のみ） |

---

## 4. データモデル

```
User
  id          UUID (PK)
  email       String (UNIQUE)
  createdAt   Timestamptz

DeadlineItem
  id              UUID (PK)
  userId          UUID (FK → User, CASCADE)
  companyName     String
  kind            es | briefing | interview | other
  deadlineAt      Timestamptz
  status          todo | submitted | done | canceled
  link            String?
  memo            String?
  statusChangedAt Timestamptz?
  createdAt / updatedAt
  INDEX: (userId, deadlineAt)

Subscription
  id                   UUID (PK)
  userId               UUID (UNIQUE FK → User, CASCADE)
  stripeCustomerId     String (UNIQUE)
  stripeSubscriptionId String (UNIQUE)
  status               String  # Stripe 準拠（active | trialing | past_due | canceled ...）
  plan                 free | pro
  currentPeriodEnd     Timestamptz?
  updatedAt

MagicLinkToken
  email     String
  token     String (UNIQUE)
  expiresAt Timestamptz
  usedAt    Timestamptz?
  INDEX: (email)

NotificationDelivery
  deadlineItemId    UUID (FK → DeadlineItem, CASCADE)
  offsetMinutes     Int
  scheduledFor      Timestamptz
  status            scheduled | sent | failed
  sentAt            Timestamptz?
  providerMessageId String?
  error             String?
  UNIQUE: (deadlineItemId, offsetMinutes)
```

> DB設定: `prisma.config.ts` で管理。CLI（migrate）は `DATABASE_URL_UNPOOLED`（直接接続）、ランタイムは `DATABASE_URL`（Neonプール接続）を使用。

---

## 5. プラン・ゲート設計

|  | Free | Pro |
|---|---|---|
| 締切アイテム上限 | **10件** | 無制限 |
| 通知タイミング | 24時間前（1440分） | 72h / 24h / 3h |
| 月額 | 無料 | **980円** |

**Pro 判定ロジック**（`features/deadlines/gate.ts`）

```
Subscription.plan === "pro"
  AND (status === "active" OR status === "trialing"
       OR currentPeriodEnd > now())
```

定数は `src/config/plans.ts` に一元管理。

---

## 6. 課金フロー（Stripe）

```
[昇格] POST /api/stripe/checkout
  → Stripe Checkout Session 作成 → Stripe ホスト画面へリダイレクト
  → 完了後 /billing/success

[管理・降格] POST /api/stripe/portal
  → Stripe Customer Portal へリダイレクト

[Webhook] POST /api/stripe/webhook
  受信イベント:
    customer.subscription.created / updated / deleted
    checkout.session.completed
  → features/billing/webhook.ts が Subscription テーブルを更新
```

---

## 7. 通知 Cron バッチ

**トリガー**: Cloudflare Cron `*/10 * * * *` → `GET /api/cron/notify`
**認証**: `Authorization: Bearer <CRON_SECRET>` ヘッダー

```
1. アクティブな DeadlineItem × オフセット一覧を結合
2. scheduled_for = deadline_at - offset_minutes
   ウィンドウ: now ± 10分 に入るものを抽出
3. notification_deliveries を upsert（一意制約で重複作成防止）
4. status = "scheduled" のみ sendEmail() 実行
5. 成否で status を sent / failed に更新
```

| プラン | オフセット |
|---|---|
| Free | 1440分（24h） |
| Pro | 4320分（72h）/ 1440分（24h）/ 180分（3h） |

---

## 8. メール送信抽象層

`src/lib/mailer/` がプロバイダを抽象化する。`EMAIL_PROVIDER` 環境変数のみで切り替え可能。

| `EMAIL_PROVIDER` | 実装 |
|---|---|
| `console`（デフォルト） | stdout に出力（ローカル開発用） |
| `resend` | Resend API 経由で送信（本番） |

---

## 9. 監視・計測

| ツール | 用途 | 初期化場所 |
|---|---|---|
| **Sentry** | クライアントエラー捕捉・Session Replay | `instrumentation-client.ts`（Next.js 15.3+ ネイティブ） |
| **PostHog** | ページビュー・イベント計測 | クライアント: `PostHogProvider.tsx` / サーバー: `lib/posthog.ts` |

> `NEXT_PUBLIC_` 系変数はビルド時にバンドルへ焼き込まれる。Cloudflare では `wrangler.toml [vars]` と CF ビルド設定の **2箇所**に設定が必要。詳細は `docs/ENV.md` 参照。

---

## 10. ミドルウェア（認証ガード）

保護パス: `/dashboard/**`、`/deadline/**`、`/billing/**`

- 未ログイン → `/login?redirect=<元パス>` にリダイレクト
- ログイン済みで `/login` 到達 → `/dashboard` にリダイレクト
- セッション検証は JWT 署名検証のみ（DB アクセスなし・Edge Runtime 対応）
- モジュール初期化時に `validateAllEnv()` を実行し、必須 ENV 欠損を即時検知

---

## 11. テスト構成

`vitest` で実行。各 feature / lib 配下の `__tests__/` に配置。

```bash
npm run test        # 全テスト実行
npm run test:auth   # 認証のみ
```

| テストファイル | 対象 |
|---|---|
| `auth/auth.test.ts` | セッション・トークン |
| `billing/webhook.test.ts` | Stripe Webhook ハンドラ |
| `billing/stripe.test.ts` | Checkout / Portal |
| `billing/portal.test.ts` | ポータル |
| `deadlines/deadlines.test.ts` | 締切 CRUD |
| `deadlines/gate.test.ts` | Pro 判定ロジック |
| `deadlines/format.test.ts` | 日時フォーマット |
| `notifications/notify.test.ts` | 通知 Cron ロジック |
| `analytics/analytics.test.ts` | イベント送信 |
| `lib/env.test.ts` | 環境変数バリデーション |
| `lib/ratelimit.test.ts` | レート制限 |
| `lib/mailer/sendEmail.test.ts` | メール送信 |

---

## 12. 環境変数

→ `docs/ENV.md` を参照。
