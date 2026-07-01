import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const taskUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  dueDate: z.string().optional(),
});

// PATCH update task
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = taskUpdateSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });

  const task = await prisma.task.update({
    where: { id, userId: (session.user as any).id },
    data: {
      ...parsed.data,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    },
  });

  // Log activity
  if (parsed.data.status) {
    await prisma.activityLog.create({
      data: {
        action: `Moved "${task.title}" to ${parsed.data.status.replace("_", " ")}`,
        taskId: task.id,
        projectId: task.projectId,
        userId: (session.user as any).id,
      },
    });
  }

  return NextResponse.json(task);
}

// DELETE task
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const task = await prisma.task.delete({
    where: { id, userId: (session.user as any).id },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      action: `Deleted task "${task.title}"`,
      projectId: task.projectId,
      userId: (session.user as any).id,
    },
  });

  return NextResponse.json({ message: "Task deleted" });
}