"use server";

import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/db/db-connection";
import { revalidatePath } from "next/cache";
import { getSession } from "./session";

export async function createColumn(order: number, formData: FormData) {
  const title = formData.get("title") as string ;
  const session = await getSession();
  const userId = session?.userId;

  if (!userId || !title) return;

  try {
    await prisma.column.create({
      data: {
        title,
        id: userId,
        order: 0,

      },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to create column:", error);
  }
}

export async function deleteColumn(columnId: string) {
  try {
    await prisma.column.delete({
      where: { id: columnId },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to delete column:", error);
  }
}

export async function createTask(
  { order, projectId }: { order: number; projectId: string },
  formData: FormData,
) {
  const title = formData.get("title") as string;
  const columnId = formData.get("columnId") as string;
  const session = await getSession();
  const userId = session?.userId;

  if (!userId || !title || !columnId) return;

  try {
    await prisma.task.create({
      data: {
        title,
        columnId,
        userId,
        order,
        projectId,
      },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to create task:", error);
  }
}

export async function deleteTask(taskId: string) {
  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
}

export async function updateTaskColumn(taskId: string, newColumnId: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { columnId: newColumnId },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to move task:", error);
  }
}

export async function updateTaskPosition(
  taskId: string,
  newColumnId: string,
  newOrder: number,
) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: {
        columnId: newColumnId,
        order: newOrder,
      },
    });
    revalidatePath("/notes");
  } catch (error) {
    console.error("Failed to update task position:", error);
  }
}

export type ColumnActionType = Prisma.ColumnGetPayload<{include:{tasks:true}}>
export async function getColumnsAction(userId: string) {
  try {
    const columns = await prisma.column.findMany({
      where: { id: userId },
      include: {
        tasks: true,
      },
      orderBy: { order: "asc" },
    }) as ColumnActionType[]
    return columns;
  } catch (error) {
    console.error("Failed to get columns:", error);
    return [];
  }
}

export async function createNote(
  projectId: string,
  data: {
    title: string;
    content: string;
    meetingDate?: string;
    attendees?: string[];
    tags?: string[];
  }
) {
  const session = await getSession();
  const userId = session?.userId;
  
  if (!userId || !projectId || !data.title || !data.content) {
    throw new Error("Missing required fields");
  }

  try {
    const note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        projectId,
        userId,
        meetingDate: data.meetingDate ? new Date(data.meetingDate) : undefined,
        attendees: data.attendees || [],
        tags: data.tags || [],
      },
    });
    revalidatePath(`/projects/${projectId}`);
    return {
      id: note.id,
      title: note.title,
      content: note.content,
      meetingDate: note.meetingDate,
      attendees: note.attendees,
      tags: note.tags,
      createdAt: note.createdAt,
      projectId: note.projectId,
    };
  } catch (error) {
    console.error("Failed to create note:", error);
    throw error;
  }
}

export async function updateNote(
  noteId: string,
  data: {
    title?: string;
    content?: string;
    meetingDate?: string;
    attendees?: string[];
    tags?: string[];
  }
) {
  const session = await getSession();
  const userId = session?.userId;
  
  if (!userId || !noteId) {
    throw new Error("Missing required fields");
  }

  try {
    await prisma.note.update({
      where: { id: noteId, userId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.meetingDate !== undefined && { meetingDate: data.meetingDate ? new Date(data.meetingDate) : null }),
        ...(data.attendees && { attendees: data.attendees }),
        ...(data.tags && { tags: data.tags }),
      },
    });
    revalidatePath(`/projects/${(await prisma.note.findUnique({ where: { id: noteId } }))?.projectId}`);
  } catch (error) {
    console.error("Failed to update note:", error);
    throw error;
  }
}

export async function deleteNote(noteId: string) {
  const session = await getSession();
  const userId = session?.userId;
  
  if (!userId || !noteId) {
    throw new Error("Missing required fields");
  }

  try {
    const note = await prisma.note.findUnique({ where: { id: noteId } });
    await prisma.note.delete({
      where: { id: noteId, userId },
    });
    if (note) {
      revalidatePath(`/projects/${note.projectId}`);
    }
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw error;
  }
}

export async function getNotesForProject(projectId: string) {
  if (!projectId) {
    return [];
  }

  try {
    const notes = await prisma.note.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    return notes.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.content,
      meetingDate: n.meetingDate,
      attendees: n.attendees,
      tags: n.tags,
      createdAt: n.createdAt,
      projectId: n.projectId,
    }));
  } catch (error) {
    console.error("Failed to get notes:", error);
    return [];
  }
}
