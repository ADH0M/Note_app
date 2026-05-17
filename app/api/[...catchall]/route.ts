import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ catchall: string[] }>;
  },
) {
  const { catchall } = await params;
  return NextResponse.json(
    {
      error: "API endpoint not found",
      path: `/${catchall.join("/")}`,
      message: "The requested API endpoint does not exist",
    },
    { status: 404 },
  );
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ catchall: string[] }> },
) {
  const { catchall } = await params;
  return NextResponse.json(
    {
      error: "API endpoint not found",
      path: `/${catchall.join("/")}`,
      message: "The requested API endpoint does not exist",
    },
    { status: 404 },
  );
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ catchall: string[] }> },
) {
  const { catchall } = await params;

  return NextResponse.json(
    {
      error: "API endpoint not found",
      path: `/${catchall.join("/")}`,
      message: "The requested API endpoint does not exist",
    },
    { status: 404 },
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ catchall: string[] }> },
) {
  const { catchall } = await params;

  return NextResponse.json(
    {
      error: "API endpoint not found",
      path: `/${catchall.join("/")}`,
      message: "The requested API endpoint does not exist",
    },
    { status: 404 },
  );
}
