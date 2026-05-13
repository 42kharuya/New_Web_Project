import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeadlineList, { type DeadlineItem } from "./DeadlineList";
import { HeroCard } from "./HeroCard";
import { FREE_ITEM_LIMIT, isProUser } from "@/features/deadlines/gate";
import { trackEvent } from "@/features/analytics";

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

  const isAtFreeLimit = !pro && items.length >= FREE_ITEM_LIMIT;
  const nextItem = items.find((i) => i.status === "todo") ?? null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      {/* HeroCard: 次の締切カウントダウン */}
      {nextItem && (
        <div className="mb-6">
          <HeroCard item={nextItem} />
        </div>
      )}

      {/* Free 枠上限バナー */}
      {isAtFreeLimit && (
        <div className="mb-4 flex items-center justify-between rounded-[var(--radius-card)] border border-[var(--u-soon-bg)] bg-[var(--u-soon-bg)] px-4 py-3 text-sm">
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
      <DeadlineList initialItems={items} />
    </main>
  );
}
