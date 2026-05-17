/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/tasks/reorder/route.ts
import prisma from "@/lib/db/db-connection";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { newIndex, userId } = await req.json();
    const { id } = await params;

    if (newIndex < 0 || isNaN(newIndex)) {
      return Response.json({ error: "invalid data" }, { status: 400 });
    }

    if (!id || !userId) {
      return Response.json({ error: "invalid data" }, { status: 400 });
    }

    let errors: { error: boolean; msg: string[] } = { error: false, msg: [] };
    await prisma.$transaction(async (t) => {
      const verifyProject = await t.project.findUnique({
        where: { id, userId },
      });
      if (!verifyProject) {
        errors = { error: true, msg: ["project not exist"] };
      }

      if (verifyProject) {
        const projects = await t.project.findMany({
          where: { userId },
          orderBy: { order: "asc" },
          select: {
            order: true,
            id: true,
            userId: true,
          },
        });
        const findIndex = projects.findIndex(p=>p.id === id);
        if(findIndex  === newIndex){
          throw new Error("same index")
        }
        const filter = projects.filter((p) => p.id !== id);
        if (newIndex <= 0) {
          const nextOrder = filter[0]?.order ?? 1000;
          const newOrder = nextOrder / 2;
          await t.project.update({ where: { id }, data: { order: newOrder } });
        } else if (newIndex >= filter.length) {
          const prevIndex = filter.length - 1;
          const prevOrder = filter[prevIndex]?.order ?? 0;
          const newOrder = prevOrder + 1000;
          await t.project.update({ where: { id }, data: { order: newOrder } });
        } else {
          const prevIndex = newIndex - 1;
          const prevOrder = filter[prevIndex].order;
          const currOrder = filter[newIndex].order;
          const newOrder = (prevOrder + currOrder) / 2;
          await t.project.update({ where: { id }, data: { order: newOrder } });
        }
      }
    });

    if (errors.error) {
      return Response.json(
        { error: "there are error in user data" },
        { status: 400 },
      );
    }

    return Response.json({success:true}, { status: 200 });
  } catch (error :any) {

    if('message' in error){
      console.log(error.message);
      return Response.json(
      { error: error.message },
      { status: 500 },
    );
    }
    return Response.json(
      { error: "Failed to reorder projects" },
      { status: 500 },
    );
  }
}
