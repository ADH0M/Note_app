import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/db-connection";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [projects, tasks, notes] = await Promise.all([
      prisma.project.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          title: true,
          userId: true,
        },
        take: 5,
      }),
      prisma.task.findMany({
        where: {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          title: true,
          projectId: true,
        },
        take: 5,
      }),
      prisma.note.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          projectId: true,
        },
        take: 5,
      }),
    ]);

    const results = [
      ...projects.map((p) => ({
        id: p.id,
        title: p.title,
        type: "project" as const,
        url: `/projects/${p.id}`,
      })),
      ...tasks.map((t) => ({
        id: t.id,
        title: t.title,
        type: "task" as const,
        url: `/projects/${t.projectId}`,
      })),
      ...notes.map((n) => ({
        id: n.id,
        title: n.title || "Untitled",
        type: "note" as const,
        url: `/notes?note=${n.id}`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}