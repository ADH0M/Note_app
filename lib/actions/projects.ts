"use server";
import { redirect } from "next/navigation";
import prisma from "../db/db-connection";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createProject(
  type: "todo" | "project_tracker" | "meeting_notes" | "task_tracker",
  userId: string,
  order: number,
) {
  if (!userId) redirect("/login");
  if (!order) {
    order = 10000;
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        title: type,
        userId,
        type,
        order: order + 2000,
      },
    });
  } catch (error) {}

  revalidatePath("/(tasks-system)/", "layout");
  revalidatePath("/", "layout");
}

export async function updateProject(
  projectId: string,
  userId: string,
  title: string,
  type?: "todo" | "project_tracker" | "meeting_notes" | "task_tracker",
) {
  if (!projectId || !userId) {
    throw new Error("Project ID and User ID are required");
  }

  if (!title || title.length <= 2) {
    return;
  }

  try {
    await prisma.project.update({
      where: { id: projectId, userId },
      data: { title, ...(type && { type }) },
    });
  } catch (error) {
    console.error("Failed to update project:", error);
    throw error;
  }
  revalidatePath("/", "layout");
}

export async function deleteProjet(userId: string, projectId: string) {
  if (!projectId || !userId) {
    redirect("/");
  }

  await prisma.project.delete({
    where: { id: projectId, userId },
  });

  revalidatePath("/", "layout");
}

export async function getProjects(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        order: true,
        title: true,
        type: true,
        createdAt: true,
        userId: true,
        _count: {
          select: {
            tasks: true,
            notes: true,
          },
        },
      },
    });
    revalidateTag("projects", "max");

    return projects.map((pr) => ({
      ...pr,
      createdAt: pr.createdAt.toISOString(),
    }));
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw new Error("Could not fetch projects");
  }
}

export async function getProject(userId: string, projectId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId },
      select: {
        type: true,
        columns: true,
        createdAt: true,
        id: true,
        image: true,
        order: true,
        notes: true,
        tasks: true,
        title: true,
        userId: true,
      },
    });
    if (!project) redirect("projects");
    const type = project.type;

    switch (type) {
      case "todo": {
        return {
          type: project.type,
          title: true,
          createdAt: true,
          tasks: project.tasks,
          id: project.id,
          image: project.image,
        };
      }
      case "meeting_notes": {
        return {
          type: project.type,
          title: true,
          createdAt: true,
          tasks: project.tasks,
          id: project.id,
          image: project.image,
        };
      }
      case "project_tracker": {
      }
      case "task_tracker": {
      }
      default:
        break;
    }
  } catch (err) {
    console.error("Error fetching projects:", err);
    throw new Error("Could not fetch projects");
  }
}

export async function getColumns(projectId: string) {
  if (!projectId) {
    return [];
  }

  try {
    const columns = await prisma.column.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
      select: {
        id: true,
        title: true,
        order: true,
        projectId: true,
      },
    });
    return columns;
  } catch (error) {
    console.error("Failed to get columns:", error);
    return [];
  }
}

export async function getOrCreateDefaultColumns(projectId: string) {
  const defaultColumns = [
    { id: "todo", title: "To Do", order: 1 },
    { id: "in_progress", title: "In Progress", order: 2 },
    { id: "review", title: "Review", order: 3 },
    { id: "done", title: "Done", order: 4 },
  ];

  try {
    //show the columns important not project
    const existing = await prisma.project.findMany({
      where: { id: projectId },
      orderBy: { order: "asc" },
    });

    if (existing.length === 0) {
      const created = await prisma.column.createMany({
        data: defaultColumns.map((col) => ({
          ...col,
          projectId,
        })),
      });
      return defaultColumns;
    }

    return existing.map((c) => ({
      id: c.id,
      title: c.title,
      order: c.order,
      projectId: c.id,
    }));
  } catch (error) {
    console.error("Failed to get/create columns:", error);
    return defaultColumns;
  }
}
