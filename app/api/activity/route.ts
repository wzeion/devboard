import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logs = await prisma.activityLog.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      project: { select: { title: true } },
      task: { select: { title: true } },
    },
  });

  return NextResponse.json(logs);
}