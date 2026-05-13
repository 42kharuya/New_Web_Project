import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeadlineList, { type DeadlineItem } from "./DeadlineList";
import { HeroCard } from "./HeroCard";
import { FREE_ITEM_LIMIT, isProUser } from "@/features/deadlines/gate";
import { trackEvent } from "@/features/analytics";

function getGreeting(h: number): string {
  if (h >= 5 && h < 12) return "GOOD MORNING";
  if (h < 17) return "GOOD AFTERNOON";
  if (h < 22) return "GOOD EVENING";
  return "GOOD NIGHT";
}

export default async function DashboardPage() {
  const session = await requireSession();

  await trackEvent({ name: "dashboard_viewed", userId: session.sub });

  const [rows, pro] = await Promise.all([
    prisma.deadlineItem.findMany({
      where: { userId: session.sub },
      orderBy: { deadlineAt: "asc" },
      select: {
        id: true,
        companyName: true,
        kind: true,
        deadlineAt: true,
        status: true,
        link: true,
        memo: true,
      },
    }),
    isProUser(session.sub),
  ]);

  const items: DeadlineItem[] = rows.map((row) => ({
    ...row,
    deadlineAt: row.deadlineAt.toISOString(),
  }));

  const now = new Date();
  const h = now.getHours();
  const dateLabel = now.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const todoItems = items.filter((i) => i.status === "todo");
  const overdueItems = todoItems.filter((i) => new Date(i.deadlineAt) < now);
  const doneItems = items.filter(
    (i) => i.status === "done" || i.status === "submitted",
  );

  const isAtFreeLimit = !pro && items.length >= FREE_ITEM_LIMIT;
  const nextItem = todoItems[0] ?? null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      {/* グリーティング行 */}
      <div className="flex items-baseline justify-between gap-3 mb-1.5">
        <span
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-4)]"
        >
          {getGreeting(h)}
        </span>
        <span className="text-xs text-[var(--ink-4)]">{dateLabel}</span>
      </div>
      <h1
        className="text-[24px] font-extrabold text-[var(--ink)] leading-tight"
        style={{ letterSpacing: "-0.025em" }}
      >
        {todoItems.length === 0
          ? "締切アイテムはありません"
          : `今日の締切は${overdueItems.length > 0 ? `${overdueItems.length}件期限切れ` : `${todoItems.length}件あります`}。`}
      </h1>

      {/* HeroCard */}
      {nextItem && (
        <div className="mt-4">
          <HeroCard item={nextItem} />
        </div>
      )}

      {/* KPI タイル */}
      {items.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-[14px] border border-[var(--rule)] bg-[var(--card)] px-3 py-3">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-4)]">
              TODO
            </p>
            <p
              className="mt-1 text-[24px] font-extrabold text-[var(--ink)]"
              style={{ letterSpacing: "-0.03em" }}
            >
              {todoItems.length}
            </p>
          </div>
          <div
            className={`rounded-[14px] border px-3 py-3 ${
              overdueItems.length > 0
                ? "border-[rgba(210,58,58,0.2)] bg-[var(--u-overdue-bg)]"
                : "border-[var(--rule)] bg-[var(--card)]"
            }`}
          >
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-4)]">
              OVERDUE
            </p>
            <p
              className="mt-1 text-[24px] font-extrabold"
              style={{
                letterSpacing: "-0.03em",
                color:
                  overdueItems.length > 0 ? "var(--u-overdue)" : "var(--ink)",
              }}
            >
              {overdueItems.length}
            </p>
          </div>
          <div className="rounded-[14px] border border-[var(--rule)] bg-[var(--card)] px-3 py-3">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--ink-4)]">
              DONE
            </p>
            <p
              className="mt-1 text-[24px] font-extrabold text-[var(--s-done)]"
              style={{ letterSpacing: "-0.03em" }}
            >
              {doneItems.length}
            </p>
          </div>
        </div>
      )}

      {/* Free 枠上限バナー */}
      {isAtFreeLimit && (
        <div className="mt-4 flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--u-soon-bg)] bg-[var(--u-soon-bg)] px-4 py-3 text-sm">
          <p className="text-[var(--u-soon)]">
            <span className="font-semibold">
              Free プランの上限（{FREE_ITEM_LIMIT}件）に達しています。
            </span>
            {"　"}
            Pro へのアップグレードで無制限に追加できます。
          </p>
          <Link
            href="/billing"
            className="ml-4 shrink-0 rounded-lg bg-[var(--u-soon)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
          >
            Pro にアップグレード
          </Link>
        </div>
      )}

      {/* 締切一覧 */}
      <DeadlineList initialItems={items} totalCount={items.length} />
    </main>
  );
}
