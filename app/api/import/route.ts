import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/db-connection";
import { Priority } from "@/generated/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = formData.get("type") as string | null;
    const userId = formData.get("userId") as string | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file || !type || !projectId ||!userId) {
      return NextResponse.json(
        { error: "Missing file, type, or projectId" },
        { status: 400 }
      );
    }

    const text = await file.text();
    return handleCsvImport(type, projectId, text ,userId);
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Import failed" },
      { status: 500 }
    );
  }
}

async function handleCsvImport(
  type: string,
  projectId: string,
  csv: string,
  userId:string,
) {
  const lines = csv.split("\n").filter((line) => line.trim());

  if (lines.length < 2) {
    return NextResponse.json(
      { error: "CSV is empty or has no data rows" },
      { status: 400 }
    );
  }

  if (type === "tasks") {
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const tasks: { title: string; description?: string; priority: Priority; completed?: boolean }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      tasks.push({
        title: row.title || "",
        description: row.description,
        priority: row.priority as Priority,
        completed: row.completed?.toLowerCase() === "yes",
      });
    }

    const maxOrder = await prisma.task.findFirst({
      where: { projectId },
      orderBy: { order: "desc" },
    });

    let order = (maxOrder?.order || 0) + 1;

    for (const task of tasks) {
      if (task.title) {
        await prisma.task.create({
          data: {
            title: task.title,
            content: task.description,
            priority: task.priority,
            state: task.completed,
            projectId,
            order: order++,
            userId
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${tasks.length} tasks`,
    });
  }

  if (type === "notes") {
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const notes: { title: string; content: string; tags: string; meetingDate?: string }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      notes.push({
        title: row.title || "",
        content: row.content,
        tags: row.tags,
        meetingDate: row["meeting date"],
      });
    }

    for (const note of notes) {
      if (note.title) {
        await prisma.note.create({
          data: {
            title: note.title,
            content: note.content,
            userId:userId,
            meetingDate: note.meetingDate ? new Date(note.meetingDate) : undefined,
            projectId,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Imported ${notes.length} notes`,
    });
  }

  return NextResponse.json(
    { error: "Unsupported import type" },
    { status: 400 }
  );
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}