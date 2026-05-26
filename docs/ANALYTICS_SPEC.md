# Analytics Spec — 〆トラ

このドキュメントは「**どのユーザー行動を・どんな条件で・どんなデータと一緒に記録するか**」を定義したものです。
PostHog などの計測ツールに送るイベントの仕様書であり、コードを読まなくても計測の全体像を把握できることを目的としています。

---

## 1. 北極星指標（最も重要な1つの数字）

> **期限内に処理できた締切数**

〆トラの本質的な価値（締切ミスを防ぐ）を最も直接的に表す指標です。

```
判定条件: status_changed_at < deadline_at
　　　　　（締切時刻より前にステータスが「提出済」に変わった件数）

集計方法: DB から上記条件を満たすレコード数を日次・週次で集計
　　　　　（イベントではなく DB 集計で算出するため、送信イベントには含めない）
```

---

## 2. KPI（追う数字）

ローンチ後2週間で以下を計測します。

| 指標 | 計算式 | 目標 |
|---|---|---|
| Signup数 | `signup` イベントの総数 | — |
| Activation率 | `activated_users ÷ signup_users` | **35%** |
| D7継続率 | `d7_active_users ÷ d0_signup_users` | **15%** |
| 2週課金率 | `paid_users ÷ signup_users` | **3%** |
| 2週MRR先行指標 | `paid_users × 980円` | **10,000円以上** |

**Activation の定義**: サインアップ後24時間以内に締切アイテムを2件作成したユーザー

**D7 Active の定義**: サインアップから6〜8日目（7日目±1日）に `dashboard_viewed` イベントがあったユーザー

---

## 3. イベント全体図

どの操作がどのイベントを発火させるかを示します。

```
ユーザー操作                     発火イベント              発火場所
─────────────────────────────────────────────────────────────────
メール認証完了（初回のみ）  →  signup               サーバー
                                   ↓（24h以内に2件作成で）
締切を2件作成               →  activation          サーバー

ダッシュボードを表示        →  dashboard_viewed     サーバー

Stripe 課金完了（初回）     →  purchase             サーバー（Webhook）

締切を作成                  →  deadline_created     サーバー
締切を更新（PATCH）         →  deadline_updated     サーバー
締切を削除（DELETE）        →  deadline_deleted     サーバー
```

> すべてサーバーサイドから送信されます（`src/features/analytics/index.ts` → PostHog）。

---

## 4. イベント詳細

### `signup`

**いつ**: メール認証が完了し、ユーザー登録が確定したとき（再ログインでは発火しない）

**発火場所**: `src/app/api/auth/verify/route.ts`

| プロパティ | 型 | 内容 |
|---|---|---|
| `userId` | string | ユーザーID |
| `method` | string | 認証方式（固定値: `email_magic_link`） |

---

### `activation`

**いつ**: サインアップ後24時間以内に締切アイテムが2件作成された瞬間（1回だけ発火）

**発火場所**: `src/app/api/deadlines/route.ts`

```
サインアップ
    ↓ 24時間以内
締切1件目作成 → まだ発火しない
締切2件目作成 → activation 発火（以降は何件作っても再発火しない）
```

| プロパティ | 型 | 内容 |
|---|---|---|
| `userId` | string | ユーザーID |
| `definition` | string | 固定値: `two_items_within_24h` |
| `time_to_value_seconds` | number | サインアップから activation までの秒数 |

---

### `dashboard_viewed`

**いつ**: ユーザーがダッシュボード（締切一覧）を表示したとき

**発火場所**: `src/app/dashboard/page.tsx`

| プロパティ | 型 | 内容 |
|---|---|---|
| `userId` | string | ユーザーID |

> D7継続率の集計は `userId` で distinct カウントします（同日に複数回表示しても1カウント）。

---

### `purchase`

**いつ**: Stripe Webhook で新規サブスクリプションが `active` になったとき（初回課金のみ）

**発火場所**: `src/app/api/stripe/webhook/route.ts`

| プロパティ | 型 | 内容 |
|---|---|---|
| `userId` | string | ユーザーID |
| `plan` | string | 固定値: `pro_monthly` |
| `amount` | number | 金額（固定値: `980`） |
| `currency` | string | 固定値: `JPY` |

---

### `deadline_created`

**いつ**: 締切アイテムが正常に作成されたとき

**発火場所**: `src/app/api/deadlines/route.ts`

| プロパティ | 型 | 内容 |
|---|---|---|
| `userId` | string | ユーザーID |
| `kind` | string | 種別（`es` / `briefing` / `interview` / `other`） |

---

### `deadline_updated`

**いつ**: 締切アイテムが更新されたとき（ステータス変更・内容編集を含む）

**発火場所**: `src/app/api/deadlines/[id]/route.ts`（PATCH）

| プロパティ | 型 | 内容 |
|---|---|---|
| `userId` | string | ユーザーID |
| `kind` | string | 種別（`es` / `briefing` / `interview` / `other`） |

---

### `deadline_deleted`

**いつ**: 締切アイテムが削除されたとき

**発火場所**: `src/app/api/deadlines/[id]/route.ts`（DELETE）

| プロパティ | 型 | 内容 |
|---|---|---|
| `userId` | string | ユーザーID |

---

## 5. プライバシールール

計測イベントに含めてはいけないデータを定義します。

| ❌ 含めてはいけないもの | 理由 |
|---|---|
| メールアドレス | PII（個人を特定できる情報）|
| 締切のメモ・リンク | ユーザーの個人的な記述内容 |
| 会社名 | 就活状況という機微な情報 |

> `userId`（内部UUID）は匿名識別子として使用可。メールアドレスとの紐付けはサーバー内のみ。

---

## 用語集

| 用語 | 意味 |
|---|---|
| イベント | ユーザーの行動を記録したデータのひとまとまり。「誰が・いつ・何をしたか」を外部サービスに送る |
| プロパティ | イベントに付随する詳細情報。例：`signup` イベントに `method: "email_magic_link"` を添付する |
| 北極星指標（NSM） | プロダクトの価値を最もよく表す1つの指標。KPIが複数あるのに対してNSMは必ず1つ |
| KPI | Key Performance Indicator。目標達成度を測る指標の総称 |
| Activation | ユーザーが初めてプロダクトの価値を実感した瞬間のこと。〆トラでは「24h以内に2件登録」と定義 |
| D7継続率 | サインアップから7日後もアクティブなユーザーの割合。プロダクトの定着度を示す |
| MRR | Monthly Recurring Revenue（月次定期収益）。毎月入ってくるサブスク収益の合計 |
| distinct カウント | 同じユーザーの重複を除いてカウントする集計方法 |
| PII | Personally Identifiable Information（個人を特定できる情報）。メールアドレス・氏名など |
| Webhook | Stripe などの外部サービスが特定のイベント発生時にこちらのサーバーへ自動送信するHTTPリクエスト |
| サーバーサイド送信 | ブラウザ（ユーザー端末）ではなくサーバーから計測データを送ること。ブロックされにくく信頼性が高い |
