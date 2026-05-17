import prisma from "@/lib/db/db-connection";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const column = await prisma.column.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(column);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update column" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.column.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete column" },
      { status: 500 },
    );
  }
}
