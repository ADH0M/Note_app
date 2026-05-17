/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import prisma from "@/lib/db/db-connection";
import { revalidatePath } from "next/cache";
import { getSession } from "./session";

export async function createTask(
  projectId: string,
  title: string,
  columnId?: string,
  priority?: string,
  dueDate?: Date
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const userId = session.id;
  
  if (!userId || !title || !projectId) {
    throw new Error("Missing required fields");
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        userId,
        projectId,
        columnId,
        state: false,
        order: Date.now(),
        priority: priority as any || "medium",
        dueDate,
      },
    });
    revalidatePath(`/projects/${projectId}`);
    return task;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
}

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    completed?: boolean;
    columnId?: string;
    priority?: string;
    dueDate?: Date;
  }
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const userId = session.id;
  
  if (!userId || !taskId) {
    throw new Error("Missing required fields");
  }

  try {
    const updateData: { title?: string; state?: boolean; columnId?: string; priority?: any; dueDate?: Date } = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.completed !== undefined) updateData.state = data.completed;
    if (data.columnId !== undefined) updateData.columnId = data.columnId;
    if (data.priority !== undefined) updateData.priority = data.priority as any;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    
    await prisma.task.update({
      where: { id: taskId, userId },
      data: updateData,
    });
    
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (task) {
      revalidatePath(`/projects/${task.projectId}`);
    }
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
}

export async function deleteTaskAction(taskId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const userId = session.id;
  
  if (!userId || !taskId) {
    throw new Error("Missing required fields");
  }

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    await prisma.task.delete({
      where: { id: taskId, userId },
    });
    if (task) {
      revalidatePath(`/projects/${task.projectId}`);
    }
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error;
  }
}

export async function updateTaskTime(taskId: string, timeSpent: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const userId = session.id;
  
  if (!userId || !taskId) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.task.update({
      where: { id: taskId, userId },
      data: { timeSpent },
    });
  } catch (error) {
    console.error("Failed to update task time:", error);
    throw error;
  }
}

export async function getTasksForProject(projectId: string, columnId?: string) {
  if (!projectId) {
    return [];
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
        ...(columnId && { columnId }),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        state: true,
        createdAt: true,
        projectId: true,
        columnId: true,
        priority: true,
        dueDate: true,
        timeSpent: true,
        hourlyRate: true,
      },
    });

    return tasks.map((t) => ({
      id: t.id,
      title: t.title,
      completed: t.state,
      createdAt: t.createdAt,
      projectId: t.projectId,
      columnId: t.columnId,
      priority: t.priority,
      dueDate: t.dueDate,
      timeSpent: t.timeSpent,
      hourlyRate: t.hourlyRate,
    }));
  } catch (error) {
    console.error("Failed to get tasks:", error);
    return [];
  }
}