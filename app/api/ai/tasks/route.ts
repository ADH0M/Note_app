import prisma from "@/lib/db/db-connection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId =  request.nextUrl.searchParams.get("userId");
    const skip =  request.nextUrl.searchParams.get("skip") ;
    

    if (!userId) {
      throw new Error("user id not defined");
    }
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        content: true,
      },
      skip:Number(skip),
      take: 10,
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}
