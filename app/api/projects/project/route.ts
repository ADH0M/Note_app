import prisma from '@/lib/db/db-connection';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        columns: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        type: body.type || 'todo',
        userId: 'user-id-placeholder', // Replace with actual user auth
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}