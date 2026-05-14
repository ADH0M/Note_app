import prisma from "@/lib/db/db-connection";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if(!body.title || !body.content || !body.projectId || !body.userId){
      return NextResponse.json({message:'Faild to create note'},{status:400})
    }

    const note = await prisma.note.create({
      data: {
        title: body.title,
        content: body.content,
        projectId: body.projectId,
        userId: body.userId,
      },
    });

    return NextResponse.json(note);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to create note",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch {
    return NextResponse.json(
      {
        message: "Failed to fetch notes",
      },
      {
        status: 500,
      },
    );
  }
}
