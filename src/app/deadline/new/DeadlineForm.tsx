"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { KIND_LABEL } from "@/features/deadlines/format";
import { scaleIn } from "@/lib/motion";

type FieldErrors = Record<string, string>;
type Status = "idle" | "submitting" | "error" | "limit_exceeded";

const KIND_OPTIONS = Object.entries(KIND_LABEL) as [string, string][];

type CreateProps = { mode: "create" };
type EditProps = {
  mode: "edit";
  id: string;
  initialCompanyName: string;
  initialKind: string;
  initialDeadlineAt: string;
  initialLink: string;
  initialMemo: string;
};

type Props = CreateProps | EditProps;

export default function DeadlineForm(props: Props) {
  const router = useRouter();

  const initial =
    props.mode === "edit"
      ? {
          companyName: props.initialCompanyName,
          kind: props.initialKind,
          deadlineAt: props.initialDeadlineAt,
          link: props.initialLink,
          memo: props.initialMemo,
        }
      : { companyName: "", kind: "", deadlineAt: "", link: "", memo: "" };

  const [companyName, setCompanyName] = useState(initial.companyName);
  const [kind, setKind] = useState(initial.kind);
  const [deadlineAt, setDeadlineAt] = useState(initial.deadlineAt);
  const [link, setLink] = useState(initial.link);
  const [memo, setMemo] = useState(initial.memo);

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!companyName.trim()) errs.company_name = "企業名は必須です";
    if (!kind) errs.kind = "種別は必須です";
    if (!deadlineAt) errs.deadline_at = "締切日時は必須です";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGlobalError("");

    const clientErrors = validate();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setStatus("error");
      return;
    }
    setFieldErrors({});
    setStatus("submitting");

    const url =
      props.mode === "edit" ? `/api/deadlines/${props.id}` : "/api/deadlines";
    const method = props.mode === "edit" ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: companyName.trim(),
          kind,
          // datetime-local は TZ なしで返るため +09:00 を付与して JST を明示する
          deadline_at: deadlineAt ? deadlineAt + "+09:00" : "",
          link: link.trim() || undefined,
          memo: memo.trim() || undefined,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
        return;
      }

      const data = await res.json().catch(() => ({}));

      if (res.status === 400 && Array.isArray(data.details)) {
        const errs: FieldErrors = {};
        for (const e of data.details as { field: string; message: string }[]) {
          errs[e.field] = e.message;
        }
        setFieldErrors(errs);
        setStatus("error");
      } else if (
        props.mode === "create" &&
        res.status === 403 &&
        data.code === "FREE_LIMIT_EXCEEDED"
      ) {
        setStatus("limit_exceeded");
      } else if (props.mode === "edit" && res.status === 404) {
        setGlobalError("締切アイテムが見つかりません。");
        setStatus("error");
      } else if (res.status === 403) {
        setGlobalError(data.error ?? "この操作は許可されていません。");
        setStatus("error");
      } else {
        setGlobalError(data.error ?? "保存に失敗しました。もう一度お試しください。");
        setStatus("error");
      }
    } catch {
      setGlobalError("ネットワークエラーが発生しました。");
      setStatus("error");
    }
  }

  const isSubmitting = status === "submitting";
  const isLimitExceeded = status === "limit_exceeded";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
      {/* Free 枠上限エラー（create モードのみ） */}
      {isLimitExceeded && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          <p className="font-semibold">Free プランの登録上限（10件）に達しました</p>
          <p className="mt-1">
            Pro にアップグレードすると締切アイテムが{" "}
            <strong>無制限</strong>になります。
          </p>
          <Link
            href="/billing"
            className="mt-2 inline-block rounded-md bg-amber-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
          >
            Pro にアップグレード →
          </Link>
        </div>
      )}

      {/* グローバルエラー */}
      {globalError && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {globalError}
        </p>
      )}

      {/* 企業名 */}
      <div>
        <label
          htmlFor="company_name"
          className="block text-sm font-medium text-slate-700"
        >
          企業名
          <span className="ml-1 text-red-500">*</span>
        </label>
        <input
          id="company_name"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="例: 株式会社テクノロジー"
          maxLength={100}
          disabled={isSubmitting}
          className={`mt-1 w-full rounded-lg border px-3 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
            fieldErrors.company_name
              ? "border-red-400 bg-red-50"
              : "border-slate-300 bg-white"
          }`}
        />
        <AnimatePresence>
          {fieldErrors.company_name && (
            <motion.p {...scaleIn} role="alert" className="mt-1 text-xs text-red-600">
              {fieldErrors.company_name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 種別 */}
      <div>
        <label
          htmlFor="kind"
          className="block text-sm font-medium text-slate-700"
        >
          種別
          <span className="ml-1 text-red-500">*</span>
        </label>
        <select
          id="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          disabled={isSubmitting}
          className={`mt-1 w-full rounded-lg border px-3 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
            fieldErrors.kind
              ? "border-red-400 bg-red-50"
              : "border-slate-300 bg-white"
          }`}
        >
          <option value="">選択してください</option>
          {KIND_OPTIONS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <AnimatePresence>
          {fieldErrors.kind && (
            <motion.p {...scaleIn} role="alert" className="mt-1 text-xs text-red-600">
              {fieldErrors.kind}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 締切日時 */}
      <div>
        <label
          htmlFor="deadline_at"
          className="block text-sm font-medium text-slate-700"
        >
          締切日時
          <span className="ml-1 text-red-500">*</span>
        </label>
        <input
          id="deadline_at"
          type="datetime-local"
          value={deadlineAt}
          onChange={(e) => setDeadlineAt(e.target.value)}
          disabled={isSubmitting}
          className={`mt-1 w-full rounded-lg border px-3 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
            fieldErrors.deadline_at
              ? "border-red-400 bg-red-50"
              : "border-slate-300 bg-white"
          }`}
        />
        <AnimatePresence>
          {fieldErrors.deadline_at && (
            <motion.p {...scaleIn} role="alert" className="mt-1 text-xs text-red-600">
              {fieldErrors.deadline_at}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* リンク（任意） */}
      <div>
        <label
          htmlFor="link"
          className="block text-sm font-medium text-slate-700"
        >
          リンク
          <span className="ml-1 text-xs text-slate-400">（任意）</span>
        </label>
        <input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com/job"
          maxLength={2048}
          disabled={isSubmitting}
          className={`mt-1 w-full rounded-lg border px-3 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
            fieldErrors.link
              ? "border-red-400 bg-red-50"
              : "border-slate-300 bg-white"
          }`}
        />
        <AnimatePresence>
          {fieldErrors.link && (
            <motion.p {...scaleIn} role="alert" className="mt-1 text-xs text-red-600">
              {fieldErrors.link}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* メモ（任意） */}
      <div>
        <label
          htmlFor="memo"
          className="block text-sm font-medium text-slate-700"
        >
          メモ
          <span className="ml-1 text-xs text-slate-400">（任意）</span>
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="選考メモ・注意事項など"
          maxLength={1000}
          rows={3}
          disabled={isSubmitting}
          className={`mt-1 w-full rounded-lg border px-3 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
            fieldErrors.memo
              ? "border-red-400 bg-red-50"
              : "border-slate-300 bg-white"
          }`}
        />
        <AnimatePresence>
          {fieldErrors.memo && (
            <motion.p {...scaleIn} role="alert" className="mt-1 text-xs text-red-600">
              {fieldErrors.memo}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 送信ボタン */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting || isLimitExceeded}
          className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "保存中..."
            : isLimitExceeded
              ? "上限に達しています"
              : props.mode === "edit"
                ? "保存する"
                : "作成する"}
        </button>
        <Link
          href="/dashboard"
          className="text-sm text-slate-500 underline hover:text-slate-700"
        >
          キャンセル
        </Link>
      </div>
    </form>
  );
}
