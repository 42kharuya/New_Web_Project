# 共通コンポーネント

> ファイル: `src/app/_components/AppHeader.tsx`, `src/app/_components/ConditionalFooter.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`

---

## AppHeader（ログイン後の全ページ）

> `src/app/_components/AppHeader.tsx`

```
〆  トラ  （ブランドロゴ → /dashboard）
```

右側アイコンボタン群（テキストなし、aria-label のみ）：

| ボタン | aria-label |
|---|---|
| 検索 | `検索` |
| 通知ベル | `通知` |
| ログアウト | `ログアウト ({メールアドレス})` / title: `ログアウト（{メールアドレス}）` |

---

## ConditionalFooter（ログイン後・LP以外の全ページ）

> `src/app/_components/ConditionalFooter.tsx`

```
利用規約 　プライバシーポリシー 　特定商取引法に基づく表記 　お問い合わせ
```

> LP（`/`）では表示されない。

---

## 404 ページ（not-found）

> `src/app/not-found.tsx`

```
（H1）  ページが見つかりません

（リンク）  / に戻る
```

---

## エラーページ（error）

> `src/app/error.tsx`

```
（H1）  エラーが発生しました

（ボタン）  再読み込み
```
