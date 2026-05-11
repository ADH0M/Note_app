/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tasks/reorder/route.ts
import prisma from "@/lib/db/db-connection";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId, title } = await req.json();
    const { id } = await params;

    if (!id || !userId || !title) {
      return Response.json({ error: "invalid data" }, { status: 400 });
    }

    await prisma.$transaction(async (t) => {
      const findProject = await t.project.findUnique({ where: { userId, id } });
      if (!findProject) {
        throw new Error("Not found project ");
      }
      await t.project.update({ where: { id }, data: { title } });
    });
    
    return Response.json({ success: true }, { status: 200 });
  } catch (error: any) {
    if ("message" in error) {
      console.log(error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(
      { error: "Failed to reorder projects" },
      { status: 500 },
    );
  }
}
