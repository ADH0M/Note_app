"use server";
import prisma from "@/lib/db/db-connection";

export async function getDashboardStats(userId: string) {
  if (!userId) {
    return { projects: 0, tasks: 0, notes: 0 };
  }

  try {
    const [projects, tasks, notes] = await Promise.all([
      prisma.project.count({ where: { userId } }),
      prisma.task.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
    ]);

    return { projects, tasks, notes };
  } catch (error) {
    console.error("Failed to get dashboard stats:", error);
    return { projects: 0, tasks: 0, notes: 0 };
  }
}

export async function getRecentProjects(userId: string, limit = 4) {
  if (!userId) {
    return [];
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        type: true,
        createdAt: true,
        _count: {
          select: {
            tasks: true,
            notes: true,
          },
        },
      },
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.type,
      tasks: p._count.tasks,
      notes: p._count.notes,
      createdAt: p.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to get recent projects:", error);
    return [];
  }
}
