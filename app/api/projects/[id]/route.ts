import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const projectSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  techStack: z.array(z.string()).optional(),
});

// PATCH update project
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = projectSchema.safeParse(body);

  if (!parsed.success)
    return NextResponse.json({ error: "Invalid inputs" }, { status: 400 });

  const project = await prisma.project.update({
    where: { id, userId: (session.user as any).id },
    data: parsed.data,
  });

  return NextResponse.json(project);
}

// DELETE project
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await prisma.project.delete({
    where: { id, userId: (session.user as any).id },
  });

  return NextResponse.json({ message: "Project deleted" });
}