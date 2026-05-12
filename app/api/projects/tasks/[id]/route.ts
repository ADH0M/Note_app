import prisma from '@/lib/db/db-connection';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const {id} = await params
    const task = await prisma.task.update({
      where: { id: id },
      data: body,
    });
    revalidatePath('/projects')
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params:Promise<{id:string}> }
) {
  try {
    const {id} = await params ;
    await prisma.task.delete({
      where: { id },
    });
    
    revalidatePath('/projects')
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}