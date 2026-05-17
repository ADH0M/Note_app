import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { catchall: string[] } }
) {
  return NextResponse.json(
    { 
      error: 'API endpoint not found',
      path: `/${params.catchall.join('/')}`,
      message: 'The requested API endpoint does not exist'
    },
    { status: 404 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { catchall: string[] } }
) {
  return NextResponse.json(
    { 
      error: 'API endpoint not found',
      path: `/${params.catchall.join('/')}`,
      message: 'The requested API endpoint does not exist'
    },
    { status: 404 }
  );
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { catchall: string[] } }
) {
  return NextResponse.json(
    { 
      error: 'API endpoint not found',
      path: `/${params.catchall.join('/')}`,
      message: 'The requested API endpoint does not exist'
    },
    { status: 404 }
  );
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { catchall: string[] } }
) {
  return NextResponse.json(
    { 
      error: 'API endpoint not found',
      path: `/${params.catchall.join('/')}`,
      message: 'The requested API endpoint does not exist'
    },
    { status: 404 }
  );
}