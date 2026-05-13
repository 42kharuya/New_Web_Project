import Link from "next/link";
import DeadlineForm from "./DeadlineForm";

export default function NewDeadlinePage() {
  return (
    <main className="mx-auto max-w-xl px-6 pb-24 pt-6">
      {/* ページヘッダー */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-lg p-1.5 text-[var(--ink-3)] hover:bg-[var(--paper-2)]"
          aria-label="ダッシュボードに戻る"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-xl font-bold text-[var(--ink)]">締切を登録する</h1>
      </div>

      <div className="mt-6">
        <DeadlineForm mode="create" />
      </div>
    </main>
  );
}
