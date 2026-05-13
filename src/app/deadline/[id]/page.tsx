import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DeadlineDetailClient } from "./DeadlineDetailClient";

type Props = { params: Promise<{ id: string }> };

export default async function DeadlineDetailPage({ params }: Props) {
  const session = await requireSession();
  const { id } = await params;

  const item = await prisma.deadlineItem.findFirst({
    where: { id, userId: session.sub },
    select: {
      id: true,
      companyName: true,
      kind: true,
      deadlineAt: true,
      status: true,
      link: true,
      memo: true,
    },
  });

  if (!item) notFound();

  return (
    <DeadlineDetailClient
      item={{
        ...item,
        deadlineAt: item.deadlineAt.toISOString(),
      }}
    />
  );
}
