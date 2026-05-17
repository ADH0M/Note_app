import { AIService } from "@/lib/services/ai-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, taskId, taskTitle, taskDescription } = body;

    if (!userId || !taskTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await AIService.getTaskSuggestion(
      userId,
      taskId,
      taskTitle,
      taskDescription,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in AI suggestions API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const history = await AIService.getTaskSuggestionsHistory(userId, limit);
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching suggestions history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
