# 締切編集フォーム `/deadline/[id]/edit`

> ファイル: `src/app/deadline/[id]/edit/page.tsx`, `src/app/deadline/new/DeadlineForm.tsx`

---

## ページヘッダー

```
（H1）  締切の編集
（注記）  * は必須項目です
```

> ※ 新規作成（`deadline-new.md`）と同じ `DeadlineForm` コンポーネントを mode="edit" で使用。
> フォームフィールド・バリデーションエラー・通知プレビューのテキストは [`deadline-new.md`](./deadline-new.md) と共通。

---

## スティッキー保存バー（編集モード）

| 状態 | ボタンテキスト |
|---|---|
| 通常 | `保存する` |
| 保存中 | `保存中…` |

```
（キャンセルリンク）  キャンセル
```
