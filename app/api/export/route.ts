import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/db-connection";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, projectId, format = "csv" } = body;

    if (!type || !projectId) {
      return NextResponse.json(
        { error: "Missing type or projectId" },
        { status: 400 }
      );
    }

    if (format === "csv") {
      return handleCsvExport(type, projectId);
    }

    return NextResponse.json(
      { error: "Unsupported format" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Export failed" },
      { status: 500 }
    );
  }
}

async function handleCsvExport(type: string, projectId: string) {
  if (type === "tasks") {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      orderBy: { order: "asc" },
    });

    const csv = [
      ["Title", "Description", "Priority", "Completed", "Due Date", "Created At"].join(","),
      ...tasks.map((t) =>
        [
          `"${(t.title || "").replace(/"/g, '""')}"`,
          `"${(t.content || "").replace(/"/g, '""')}"`,
          t.priority || "",
          t.state ? "Yes" : "No",
          t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "",
          new Date(t.createdAt).toISOString(),
        ].join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="tasks-${projectId}.csv"`,
      },
    });
  }

  if (type === "project") {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { tasks: { orderBy: { order: "asc" } } },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const csv = [
      ["Project Title", "Type", "Task Count", "Created At"].join(","),
      [
        `"${project.title.replace(/"/g, '""')}"`,
        project.type,
        project.tasks.length,
        new Date(project.createdAt).toISOString(),
      ].join(","),
      "",
      ["Tasks"].join(","),
      ["Title", "Description", "Priority", "Completed", "Due Date"].join(","),
      ...project.tasks.map((t) =>
        [
          `"${(t.title || "").replace(/"/g, '""')}"`,
          `"${(t.content || "").replace(/"/g, '""')}"`,
          t.priority || "",
          t.state ? "Yes" : "No",
          t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "",
        ].join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="project-${projectId}.csv"`,
      },
    });
  }

  if (type === "notes") {
    const notes = await prisma.note.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    const csv = [
      ["Title", "Content", "Tags", "Meeting Date", "Created At"].join(","),
      ...notes.map((n) =>
        [
          `"${(n.title || "").replace(/"/g, '""')}"`,
          `"${(n.content || "").replace(/"/g, '""')}"`,
          `"${Array.isArray(n.tags) ? n.tags.join(", ") : n.tags || ""}.replace(/"/g, '""')}"`,
          n.meetingDate
            ? new Date(n.meetingDate).toISOString().split("T")[0]
            : "",
          new Date(n.createdAt).toISOString(),
        ].join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="notes-${projectId}.csv"`,
      },
    });
  }

  return NextResponse.json(
    { error: "Unsupported export type" },
    { status: 400 }
  );
}