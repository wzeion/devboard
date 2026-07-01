import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  techStack: z.array(z.string()).optional(),
});

// GET all projects
export async function GET() {
  const session = await auth();
  if (!session?.user) 
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tasks: true } } },
  });

  return NextResponse.json(projects);
}

// POST create project
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      techStack: parsed.data.techStack ?? [],
      userId: (session.user as any).id,
    },
  });

  return NextResponse.json(project, { status: 201 });
}