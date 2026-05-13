"use client";

import { useState } from "react";
import Link from "next/link";
import { HeroCard } from "@/app/dashboard/HeroCard";
import type { DeadlineItem } from "@/app/dashboard/DeadlineList";
import { KIND_LABEL, STATUS_LABEL, formatDeadline } from "@/features/deadlines/format";

const STATUS_BUTTONS: {
  value: DeadlineItem["status"];
  label: string;
  active: string;
  inactive: string;
}[] = [
  {
    value: "todo",
    label: STATUS_LABEL.todo,
    active: "bg-[var(--paper-2)] text-[var(--ink)] ring-2 ring-[var(--ink)]",
    inactive: "bg-[var(--paper-2)] text-[var(--ink-3)]",
  },
  {
    value: "submitted",
    label: STATUS_LABEL.submitted,
    active: "bg-brand/10 text-brand ring-2 ring-brand",
    inactive: "bg-[var(--paper-2)] text-[var(--ink-3)]",
  },
  {
    value: "done",
    label: STATUS_LABEL.done,
    active: "bg-[var(--s-done-bg)] text-[var(--s-done)] ring-2 ring-[var(--s-done)]",
    inactive: "bg-[var(--paper-2)] text-[var(--ink-3)]",
  },
  {
    value: "canceled",
    label: STATUS_LABEL.canceled,
    active: "bg-[var(--paper-2)] text-[var(--ink-4)] ring-2 ring-[var(--ink-4)]",
    inactive: "bg-[var(--paper-2)] text-[var(--ink-3)]",
  },
];

const NOTIFY_SCHEDULE = ["72時間前", "24時間前", "3時間前"];

export function DeadlineDetailClient({ item: initialItem }: { item: DeadlineItem }) {
  const [item, setItem] = useState(initialItem);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  async function handleStatusChange(newStatus: DeadlineItem["status"]) {
    const prev = item;
    setUpdating(true);
    setError("");
    setItem((i) => ({ ...i, status: newStatus }));
    try {
      const res = await fetch(`/api/deadlines/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "更新に失敗しました");
      }
    } catch (err) {
      setItem(prev);
      setError(err instanceof Error ? err.message : "ステータスの更新に失敗しました");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 pb-12 pt-6">
      {/* 戻るボタン */}
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 rounded-lg p-1.5 text-sm text-[var(--ink-3)] hover:bg-[var(--paper-2)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        ダッシュボード
      </Link>

      {/* HeroCard */}
      <HeroCard item={item} />

      {/* ステータス 4 択 */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {STATUS_BUTTONS.map(({ value, label, active, inactive }) => (
          <button
            key={value}
            onClick={() => handleStatusChange(value)}
            disabled={updating}
            className={`rounded-xl py-2.5 text-xs font-semibold transition-all disabled:opacity-50 ${
              item.status === value ? active : inactive
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-xs text-[var(--u-overdue)]">{error}</p>
      )}

      {/* 詳細行 */}
      <div className="mt-5 rounded-[var(--radius-card)] bg-[var(--card)] p-5 shadow-[var(--shadow-card)]">
        <dl className="divide-y divide-[var(--rule)] text-sm">
          <Row label="締切日時" value={formatDeadline(item.deadlineAt)} />
          <Row label="種別" value={KIND_LABEL[item.kind]} />
          {item.link && (
            <div className="flex items-start gap-3 py-3">
              <dt className="w-20 shrink-0 text-[var(--ink-3)]">リンク</dt>
              <dd className="min-w-0 flex-1">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-brand underline"
                >
                  公募リンク ↗
                </a>
              </dd>
            </div>
          )}
          {item.memo && <Row label="メモ" value={item.memo} />}
        </dl>
      </div>

      {/* 通知スケジュール */}
      <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--rule)] bg-[var(--paper)] p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ink-3)]">
          通知スケジュール
        </p>
        <div className="mt-3 space-y-2">
          {NOTIFY_SCHEDULE.map((label) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span className="text-sm text-[var(--ink-2)]">{label}にメール通知</span>
              </div>
              <span className="rounded-full bg-[var(--paper-2)] px-2 py-0.5 text-xs text-[var(--ink-4)]">
                待機中
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 編集ボタン */}
      <div className="mt-6">
        <Link
          href={`/deadline/${item.id}/edit`}
          className="block rounded-xl border border-[var(--rule)] py-3 text-center text-sm font-semibold text-[var(--ink-2)] hover:bg-[var(--paper-2)]"
        >
          編集する
        </Link>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <dt className="w-20 shrink-0 text-[var(--ink-3)]">{label}</dt>
      <dd className="text-[var(--ink)]">{value}</dd>
    </div>
  );
}
