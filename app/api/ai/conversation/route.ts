import { AIService } from "@/lib/services/ai-service";
import { NextRequest, NextResponse } from "next/server";

// POST - Save conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, messages } = body;

    if (!userId || !messages) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const conversation = await AIService.saveConversation(userId, messages);
    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    console.error("Error saving conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET - Get conversation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const conversation = await AIService.getConversation(userId);
    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
