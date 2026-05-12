import prisma from '@/lib/db/db-connection';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const columnId = searchParams.get('columnId');
  
  try {
    const tasks = await prisma.task.findMany({
      where: { columnId: columnId || undefined },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        title: body.title,
        content: body.content,
        priority: body.priority || 'medium',
        columnId: body.columnId,
        projectId: body.projectId,
        userId: body.userId, 
        order: body.order || 0,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}