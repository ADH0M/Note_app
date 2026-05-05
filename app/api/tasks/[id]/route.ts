import prisma from "@/lib/db/db-connection";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return new Response(null, { status: 404 });
    await prisma.task.delete({
      where: {
        id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return new Response(null, { status: 404 });
    await prisma.task.delete({
      where: {
        id,
      },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Delete error:", error);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}