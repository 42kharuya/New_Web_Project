"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { KIND_LABEL } from "@/features/deadlines/format";
import { scaleIn } from "@/lib/motion";

type FieldErrors = Record<string, string>;
type Status = "idle" | "submitting" | "error" | "limit_exceeded";

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

const KIND_TILES = [
  { value: "es", label: "ES", icon: "📝", desc: "エントリーシート" },
  { value: "briefing", label: "説明会", icon: "📅", desc: "イベント・会社説明会" },
  { value: "interview", label: "面接", icon: "🗣️", desc: "面接・選考" },
  { value: "other", label: "その他", icon: "📌", desc: "その他の選考" },
] as const;

const QUICK_TIMES = [
  {
    label: "今夜",
    getDate() {
      const d = new Date();
      d.setHours(23, 59, 0, 0);
      return d;
    },
  },
  {
    label: "明日",
    getDate() {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(23, 59, 0, 0);
      return d;
    },
  },
  {
    label: "3日後",
    getDate() {
      const d = new Date();
      d.setDate(d.getDate() + 3);
      d.setHours(23, 59, 0, 0);
      return d;
    },
  },
  {
    label: "1週間後",
    getDate() {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      d.setHours(23, 59, 0, 0);
      return d;
    },
  },
] as const;

function toDatetimeLocal(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

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
        setGlobalError(
          data.error ?? "保存に失敗しました。もう一度お試しください。",
        );
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
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Free 枠上限エラー */}
      {isLimitExceeded && (
        <div
          role="alert"
          className="rounded-[var(--radius-card)] border border-[var(--u-soon-bg)] bg-[var(--u-soon-bg)] px-4 py-3 text-sm text-[var(--u-soon)]"
        >
          <p className="font-semibold">
            Free プランの登録上限（10件）に達しました
          </p>
          <p className="mt-1">
            Pro にアップグレードすると締切アイテムが<strong>無制限</strong>
            になります。
          </p>
          <Link
            href="/billing"
            className="mt-2 inline-block rounded-xl bg-[var(--u-soon)] px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Pro にアップグレード →
          </Link>
        </div>
      )}

      {globalError && (
        <p
          role="alert"
          className="rounded-xl bg-[var(--u-overdue-bg)] px-4 py-2 text-sm text-[var(--u-overdue)]"
        >
          {globalError}
        </p>
      )}

      {/* 企業名 */}
      <div>
        <label
          htmlFor="company_name"
          className="block text-sm font-semibold text-[var(--ink-2)]"
        >
          企業名
          <span className="ml-1 text-[var(--u-overdue)]">*</span>
        </label>
        <input
          id="company_name"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="例: 株式会社テクノロジー"
          maxLength={100}
          disabled={isSubmitting}
          className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 ${
            fieldErrors.company_name
              ? "border-[var(--u-overdue)] bg-[var(--u-overdue-bg)]"
              : "border-[var(--rule)] bg-[var(--card)]"
          }`}
        />
        <AnimatePresence>
          {fieldErrors.company_name && (
            <motion.p
              {...scaleIn}
              role="alert"
              className="mt-1 text-xs text-[var(--u-overdue)]"
            >
              {fieldErrors.company_name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 種別タイル */}
      <div>
        <p className="text-sm font-semibold text-[var(--ink-2)]">
          種別
          <span className="ml-1 text-[var(--u-overdue)]">*</span>
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {KIND_TILES.map(({ value, label, icon, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setKind(value)}
              disabled={isSubmitting}
              className={`relative rounded-[var(--radius-card)] border-2 p-4 text-left transition-all disabled:opacity-50 ${
                kind === value
                  ? "border-brand bg-brand/5"
                  : "border-[var(--rule)] bg-[var(--card)] hover:border-brand/40"
              }`}
            >
              {kind === value && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                  ✓
                </span>
              )}
              <span className="text-2xl">{icon}</span>
              <p className="mt-1.5 text-sm font-semibold text-[var(--ink)]">
                {label}
              </p>
              <p className="text-xs text-[var(--ink-3)]">{desc}</p>
            </button>
          ))}
        </div>
        <AnimatePresence>
          {fieldErrors.kind && (
            <motion.p
              {...scaleIn}
              role="alert"
              className="mt-1 text-xs text-[var(--u-overdue)]"
            >
              {fieldErrors.kind}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 締切日時 + クイック選択 */}
      <div>
        <label
          htmlFor="deadline_at"
          className="block text-sm font-semibold text-[var(--ink-2)]"
        >
          締切日時
          <span className="ml-1 text-[var(--u-overdue)]">*</span>
        </label>
        <input
          id="deadline_at"
          type="datetime-local"
          value={deadlineAt}
          onChange={(e) => setDeadlineAt(e.target.value)}
          disabled={isSubmitting}
          className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 ${
            fieldErrors.deadline_at
              ? "border-[var(--u-overdue)] bg-[var(--u-overdue-bg)]"
              : "border-[var(--rule)] bg-[var(--card)]"
          }`}
        />
        {/* クイック時間チップ */}
        <div className="mt-2 flex flex-wrap gap-2">
          {QUICK_TIMES.map(({ label, getDate }) => (
            <button
              key={label}
              type="button"
              onClick={() => setDeadlineAt(toDatetimeLocal(getDate()))}
              disabled={isSubmitting}
              className="rounded-full bg-[var(--paper-2)] px-3 py-1 text-xs font-semibold text-[var(--ink-2)] hover:bg-brand/10 hover:text-brand disabled:opacity-50"
            >
              {label}
            </button>
          ))}
        </div>
        <AnimatePresence>
          {fieldErrors.deadline_at && (
            <motion.p
              {...scaleIn}
              role="alert"
              className="mt-1 text-xs text-[var(--u-overdue)]"
            >
              {fieldErrors.deadline_at}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* リンク（任意） */}
      <div>
        <label
          htmlFor="link"
          className="block text-sm font-semibold text-[var(--ink-2)]"
        >
          リンク
          <span className="ml-1 text-xs font-normal text-[var(--ink-4)]">
            （任意）
          </span>
        </label>
        <input
          id="link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com/job"
          maxLength={2048}
          disabled={isSubmitting}
          className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 ${
            fieldErrors.link
              ? "border-[var(--u-overdue)] bg-[var(--u-overdue-bg)]"
              : "border-[var(--rule)] bg-[var(--card)]"
          }`}
        />
      </div>

      {/* メモ（任意） */}
      <div>
        <label
          htmlFor="memo"
          className="block text-sm font-semibold text-[var(--ink-2)]"
        >
          メモ
          <span className="ml-1 text-xs font-normal text-[var(--ink-4)]">
            （任意）
          </span>
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="選考メモ・注意事項など"
          maxLength={1000}
          rows={3}
          disabled={isSubmitting}
          className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50 ${
            fieldErrors.memo
              ? "border-[var(--u-overdue)] bg-[var(--u-overdue-bg)]"
              : "border-[var(--rule)] bg-[var(--card)]"
          }`}
        />
      </div>

      {/* 通知スケジュールプレビュー */}
      <div className="rounded-[var(--radius-card)] border border-[var(--rule)] bg-[var(--paper)] p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-3)]">
          通知スケジュール
        </p>
        <div className="mt-3 space-y-2">
          {["72時間前", "24時間前", "3時間前"].map((label) => (
            <div key={label} className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="text-sm text-[var(--ink-2)]">
                {label}にメール通知
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* スティッキー保存バー */}
      <div className="sticky bottom-0 -mx-6 border-t border-[var(--rule)] bg-[var(--paper)]/95 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || isLimitExceeded}
            className="flex-1 rounded-xl bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "保存中…"
              : isLimitExceeded
                ? "上限に達しています"
                : props.mode === "edit"
                  ? "保存する"
                  : "作成する"}
          </button>
          <Link
            href="/dashboard"
            className="text-sm text-[var(--ink-3)] hover:text-[var(--ink-2)]"
          >
            キャンセル
          </Link>
        </div>
      </div>
    </form>
  );
}
