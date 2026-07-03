import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const [totalProjects, totalTasks, tasksByStatus, recentLogs] =
    await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.task.count({ where: { userId } }),
      prisma.task.groupBy({
        by: ["status"],
        where: { userId },
        _count: { status: true },
      }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { project: { select: { title: true } } },
      }),
    ]);

  const completedTasks = tasksByStatus.find((t) => t.status === "DONE")?._count.status ?? 0;

  const inProgressTasks = tasksByStatus.find((t) => t.status === "IN_PROGRESS")?._count.status ?? 0;

  const todoTasks = tasksByStatus.find((t) => t.status === "TODO")?._count.status ?? 0;

  return NextResponse.json({
    totalProjects,
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    recentLogs,
  });
}