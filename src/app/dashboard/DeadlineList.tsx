"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatDeadline,
  getUrgencyLevel,
  KIND_LABEL,
  STATUS_LABEL,
} from "@/features/deadlines/format";
import { UrgencyRing } from "./UrgencyRing";

export type DeadlineItem = {
  id: string;
  companyName: string;
  kind: "es" | "briefing" | "interview" | "other";
  deadlineAt: string;
  status: "todo" | "submitted" | "done" | "canceled";
  link: string | null;
  memo: string | null;
};

type FilterState = "all" | "todo" | "done";

const STATUS_CYCLE: Record<DeadlineItem["status"], DeadlineItem["status"]> = {
  todo: "submitted",
  submitted: "done",
  done: "todo",
  canceled: "todo",
};

const STATUS_PILL: Record<
  DeadlineItem["status"],
  { label: string; className: string }
> = {
  todo: {
    label: STATUS_LABEL.todo,
    className: "bg-[var(--paper-2)] text-[var(--ink-2)]",
  },
  submitted: {
    label: STATUS_LABEL.submitted,
    className: "bg-brand/10 text-brand",
  },
  done: {
    label: STATUS_LABEL.done,
    className: "bg-[var(--s-done-bg)] text-[var(--s-done)]",
  },
  canceled: {
    label: STATUS_LABEL.canceled,
    className: "bg-[var(--paper-2)] text-[var(--ink-4)]",
  },
};

const FILTER_CHIPS: { key: FilterState; label: string }[] = [
  { key: "all", label: "全て" },
  { key: "todo", label: "未対応" },
  { key: "done", label: "済" },
];

type Props = {
  initialItems: DeadlineItem[];
};

export default function DeadlineList({ initialItems }: Props) {
  const [items, setItems] = useState<DeadlineItem[]>(initialItems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterState>("all");

  const filteredItems = items.filter((item) => {
    if (filter === "todo") return item.status === "todo";
    if (filter === "done")
      return (
        item.status === "done" ||
        item.status === "submitted" ||
        item.status === "canceled"
      );
    return true;
  });

  async function handleStatusChange(id: string, newStatus: string) {
    const prevItems = items;
    setUpdatingId(id);
    setErrorMsg(null);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus as DeadlineItem["status"] }
          : item,
      ),
    );
    try {
      const res = await fetch(`/api/deadlines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "ステータスの更新に失敗しました");
      }
    } catch (err) {
      setItems(prevItems);
      setErrorMsg(
        err instanceof Error ? err.message : "ステータスの更新に失敗しました",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function handleDelete(id: string) {
    setConfirmDeleteId(id);
  }

  async function executeDelete(id: string) {
    const prevItems = items;
    setConfirmDeleteId(null);
    setDeletingId(id);
    setErrorMsg(null);
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      const res = await fetch(`/api/deadlines/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "削除に失敗しました");
      }
    } catch (err) {
      setItems(prevItems);
      setErrorMsg(err instanceof Error ? err.message : "削除に失敗しました");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-5xl font-black text-[var(--ink-4)]">〆</span>
        <p className="text-sm font-medium text-[var(--ink-3)]">
          締切アイテムがまだありません
        </p>
        <p className="text-xs text-[var(--ink-4)]">
          まずは
          <span className="font-semibold text-[var(--ink-2)]">2件登録</span>
          して、締切管理をスタートしましょう
        </p>
        <Link
          href="/deadline/new"
          className="mt-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          + 締切を登録する
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {/* フィルターチップ */}
      <div className="flex gap-2">
        {FILTER_CHIPS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              filter === key
                ? "bg-[var(--ink)] text-white"
                : "bg-[var(--paper-2)] text-[var(--ink-3)] hover:text-[var(--ink-2)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mt-3 rounded-xl bg-[var(--u-overdue-bg)] px-4 py-2 text-sm text-[var(--u-overdue)]"
        >
          ⚠ {errorMsg}
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="mt-8 py-12 text-center text-sm text-[var(--ink-4)]">
          該当する締切はありません
        </div>
      ) : (
        <motion.ul
          className="mt-4 space-y-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          <AnimatePresence>
            {filteredItems.map((item) => {
              const urgency = getUrgencyLevel(item.deadlineAt);
              const isUpdating = updatingId === item.id;
              const isDeleting = deletingId === item.id;
              const isConfirming = confirmDeleteId === item.id;
              const isDone =
                item.status === "done" || item.status === "canceled";

              const pillStyle = STATUS_PILL[item.status];

              const stripeColor = {
                overdue: "var(--u-overdue)",
                today: "var(--u-today)",
                soon: "var(--u-soon)",
                normal: "transparent",
              }[urgency];

              return (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.25, ease: "easeOut" },
                    },
                  }}
                  layout
                  exit={{ opacity: 0, scale: 0.96 }}
                  className={`relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-px hover:shadow-[var(--shadow-pop)] ${
                    isUpdating || isDeleting ? "opacity-60" : ""
                  } ${isConfirming ? "ring-1 ring-[var(--u-overdue)]" : ""} ${
                    isDone ? "opacity-70" : ""
                  }`}
                >
                  {/* 緊急度ストライプ */}
                  <div
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-full"
                    style={{ background: stripeColor }}
                    aria-hidden="true"
                  />

                  <div className="flex items-center gap-3 pl-3">
                    {/* UrgencyRing */}
                    <UrgencyRing iso={item.deadlineAt} urgency={urgency} />

                    {/* メイン情報 → 詳細ページへのリンク */}
                    <Link
                      href={`/deadline/${item.id}`}
                      className="min-w-0 flex-1"
                    >
                      <p
                        className={`truncate font-semibold text-[var(--ink)] ${
                          isDone ? "line-through" : ""
                        }`}
                      >
                        {item.companyName}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--ink-3)]">
                        <span
                          className={`kind-${item.kind} rounded-full px-2 py-0.5 text-[11px] font-semibold`}
                        >
                          {KIND_LABEL[item.kind]}
                        </span>
                        <span>{formatDeadline(item.deadlineAt)}</span>
                      </p>
                      {item.memo && (
                        <p className="mt-1 line-clamp-1 text-xs text-[var(--ink-4)]">
                          {item.memo}
                        </p>
                      )}
                    </Link>

                    {/* 右列: ステータスピル + 操作 */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(item.id, STATUS_CYCLE[item.status])
                        }
                        disabled={isUpdating || isDeleting}
                        aria-label={`${item.companyName}のステータスを変更`}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${pillStyle.className}`}
                      >
                        {pillStyle.label}
                      </button>

                      <div className="flex items-center gap-1">
                        <Link
                          href={`/deadline/${item.id}/edit`}
                          aria-label={`${item.companyName}を編集`}
                          className="rounded-lg p-1.5 text-[var(--ink-4)] hover:bg-[var(--paper-2)] hover:text-[var(--ink-2)]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H7v-3a2 2 0 01.586-1.414z"
                            />
                          </svg>
                        </Link>

                        {isConfirming ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => executeDelete(item.id)}
                              className="rounded-lg px-2 py-1 text-xs font-semibold text-white"
                              style={{ background: "var(--u-overdue)" }}
                            >
                              削除
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-lg px-2 py-1 text-xs text-[var(--ink-3)] hover:bg-[var(--paper-2)]"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isUpdating || isDeleting}
                            aria-label={`${item.companyName}を削除`}
                            className="rounded-lg p-1.5 text-[var(--ink-4)] hover:bg-[var(--u-overdue-bg)] hover:text-[var(--u-overdue)] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isDeleting ? (
                              <span className="text-[10px]">…</span>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1H5"
                                />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* FAB */}
      <Link
        href="/deadline/new"
        aria-label="締切を追加"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl font-black text-white shadow-[var(--shadow-pop)] transition-transform hover:bg-brand-hover active:scale-95"
      >
        +
      </Link>
    </div>
  );
}
