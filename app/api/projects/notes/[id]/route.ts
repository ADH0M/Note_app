import prisma from "@/lib/db/db-connection";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch note" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }


    console.log(body);

    const updatedNote = await prisma.note.update({
      where: {
        id,
      },
      data: {
        title: body.title,
        content: body.content,
        tags: body.tags,
        attendees: body.attendees,
        actionItems: body.actionItems,
        meetingDate: new Date(body.meetingDate),
        
      },
    });

    
    return NextResponse.json(updatedNote);
  } catch {
    return NextResponse.json(
      { message: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "Note not found" }, { status: 404 });
  }

  try {
    await prisma.note.delete({
      where: {
        id
      },
    });

    return NextResponse.json({
      message: "Deleted successfully",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete note" },
      { status: 500 },
    );
  }
}
