import { notFound } from "next/navigation";
import { getSession } from "@/features/auth/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DeadlineForm from "@/app/deadline/new/DeadlineForm";

type Props = {
  params: Promise<{ id: string }>;
};

/** ISO 文字列を JST の datetime-local 形式（YYYY-MM-DDTHH:MM）に変換する */
function toJstDatetimeLocal(iso: string): string {
  const date = new Date(iso);
  return date
    .toLocaleString("sv-SE", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(" ", "T")
    .slice(0, 16);
}

export default async function DeadlineEditPage({ params }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const item = await prisma.deadlineItem.findFirst({
    where: { id, userId: session.sub },
    select: {
      id: true,
      companyName: true,
      kind: true,
      deadlineAt: true,
      link: true,
      memo: true,
    },
  });

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">締切の編集</h1>
      <p className="mt-1 text-sm text-slate-500">
        <span className="text-red-500">*</span> は必須項目です
      </p>
      <DeadlineForm
        mode="edit"
        id={item.id}
        initialCompanyName={item.companyName}
        initialKind={item.kind}
        initialDeadlineAt={toJstDatetimeLocal(item.deadlineAt.toISOString())}
        initialLink={item.link ?? ""}
        initialMemo={item.memo ?? ""}
      />
    </main>
  );
}
