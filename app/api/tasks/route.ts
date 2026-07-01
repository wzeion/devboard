import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  dueDate: z.string().optional(),
  projectId: z.string(),
});

// GET all tasks for a project
export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId)
    return NextResponse.json({ error: "projectId required" }, { status: 400 });

    const tasks = await prisma.task.findMany({
    where: {
        projectId,
        userId: (session.user as any).id,
    },
    orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(tasks);
}

// POST create task
export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsed = taskSchema.safeParse(body);

    if (!parsed.success){
    return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });
    }
    const task = await prisma.task.create({
    data: {
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
        userId: (session.user as any).id,
    },
    });

    // Log activity
    await prisma.activityLog.create({
    data: {
        action: `Created task "${task.title}"`,
        taskId: task.id,
        projectId: parsed.data.projectId,
        userId: (session.user as any).id,
    },
    });

    return NextResponse.json(task, { status: 201 });
}