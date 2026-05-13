# Shimetra デザインシステム

## 1. Brand（ブランドアイデンティティ）

Shimetra のブランドカラーは **Indigo-600 (#4f46e5)** を軸とする。
白背景との組み合わせで緊急度カラー（赤・橙）が最も映え、「頼れる・冷静」な就活ツールの印象を作る。

---

## 2. カラーパレット

| 用途 | クラス | Hex | 説明 |
|---|---|---|---|
| Primary | `bg-brand` / `text-brand` | `#4f46e5` | Shimetra ブランドカラー（Indigo-600）|
| Primary Light | `bg-brand-light` | `#eef2ff` | ホバー背景・薄いアクセント（Indigo-50）|
| Primary Hover | `hover:bg-brand-hover` | `#4338ca` | ボタン hover 状態（Indigo-700）|
| Neutral | `text-gray-900` | `#111827` | 本文テキスト |
| Neutral Sub | `text-gray-500` | `#6b7280` | サブテキスト・補足情報 |
| BG | `bg-white` | `#ffffff` | ページ背景 |
| BG Sub | `bg-gray-50` | `#f9fafb` | カード背景・サブセクション |

### 緊急度カラー（変更禁止 — 意味を持つ色）

| 状態 | バッジ背景 | バッジテキスト |
|---|---|---|
| 期限超過（overdue） | `bg-red-50` | `text-red-600` |
| 当日（today） | `bg-orange-50` | `text-orange-600` |
| 3日以内（soon） | `bg-yellow-50` | `text-yellow-700` |
| 通常（normal） | `bg-indigo-50` | `text-indigo-700` |

### ステータスカラー

| ステータス | バッジ背景 | バッジテキスト |
|---|---|---|
| todo | `bg-gray-100` | `text-gray-700` |
| submitted | `bg-indigo-100` | `text-indigo-700` |
| done | `bg-green-100` | `text-green-700` |
| canceled | `bg-gray-100` | `text-gray-400` |

---

## 3. タイポグラフィ

### フォント

```
フォントスタック: "Inter", "Noto Sans JP", sans-serif
```

- **Inter** (`@fontsource/inter`) — 欧文・数字
- **Noto Sans JP** (`@fontsource/noto-sans-jp`) — 日本語

### スケール

| 用途 | クラス |
|---|---|
| Hero 見出し | `text-5xl sm:text-7xl font-black tracking-tighter` |
| セクション見出し | `text-3xl sm:text-4xl font-bold` |
| ページ見出し | `text-2xl font-bold` |
| カードタイトル | `text-base font-semibold` |
| 本文 | `text-sm font-normal` |
| キャプション | `text-xs text-gray-500` |

---

## 4. モーションシステム

アニメーション定数は `src/lib/motion.ts` に集約する。

```ts
import { fadeUp, stagger, scaleIn } from "@/lib/motion";
```

### 定数一覧

| 定数 | 用途 |
|---|---|
| `fadeUp` | ページ初期表示・スクロール連動で要素が下から出現 |
| `stagger` | リスト親要素に適用し子要素を順番に出現させる |
| `scaleIn` | バッジ切り替え・モーダル出現などの小さい変化 |

### 適用ルール

- LP Hero: `fadeUp` で見出し・CTAを下から出現
- LP セクション: Intersection Observer + `fadeUp` でスクロール連動
- ダッシュボードリスト: `stagger` でアイテムが順番に出現
- ステータスバッジ変更: `scaleIn` で切り替え
- ページ遷移: `AnimatePresence` + `fadeUp` でフェード

### prefers-reduced-motion

`globals.css` にメディアクエリを設定済み。アニメーションは自動的に無効化される。

---

## 5. コンポーネント

### Button variants

```
Primary:   bg-brand text-white hover:bg-brand-hover
Secondary: border border-gray-300 text-gray-700 hover:bg-gray-50
Danger:    bg-red-600 text-white hover:bg-red-700
Ghost:     text-brand hover:bg-brand-light
```

### Card

```
bg-white border border-gray-200 rounded-xl p-4 shadow-sm
```

### Badge（緊急度）

```
rounded-full px-2.5 py-0.5 text-xs font-semibold
```

---

## 6. Patterns（ページレイアウト）

### LP

- 白背景 + Indigo アクセント
- Hero は `font-black tracking-tighter` の大見出し
- CTA は `bg-brand` Primary ボタン

### ダッシュボード

- ヘッダー: Indigo ブランドカラー
- カードリスト: `bg-gray-50` 背景上に `bg-white` カード

### フォーム

- `max-w-2xl` でセンタリング
- フォーカスリング: `focus:ring-brand`
- エラー状態: `border-red-400 bg-red-50`

---

## 7. Do / Don't

### Do

- Primary カラーには必ず `#4f46e5` (brand) を使う
- アニメーションは `src/lib/motion.ts` の定数を再利用する
- フォントサイズはスケール表に従う
- 緊急度・ステータスカラーはパレット表から選ぶ

### Don't

- `blue-600` を Primary として使わない（Indigo と混同される）
- インラインスタイルでアニメーションを実装しない
- `setTimeout` ベースのアニメーションを新規実装しない
- 緊急度カラーを装飾目的に流用しない（意味が壊れる）
