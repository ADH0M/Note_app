import { AIService } from "@/lib/services/ai-service";
import { NextRequest, NextResponse } from "next/server";

// POST - Generate daily plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, tasks, userMessage } = body;

    if (!userId || !tasks) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await AIService.generateDailyPlan(
      userId,
      tasks,
      userMessage,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating daily plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET - Get plans history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const history = await AIService.getPlansHistory(userId, limit);
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching plans history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
