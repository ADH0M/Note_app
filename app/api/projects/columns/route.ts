import prisma from '@/lib/db/db-connection';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  try {
    const columns = await prisma.column.findMany({
      where: { projectId: projectId || undefined },
      include: {
        tasks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(columns);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch columns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const column = await prisma.column.create({
      data: {
        title: body.title,
        order: body.order || 0,
        projectId: body.projectId,
      },
      include: { tasks: true },
    });
    return NextResponse.json(column);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create column' }, { status: 500 });
  }
}