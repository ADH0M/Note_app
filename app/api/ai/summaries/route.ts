import { AIService } from "@/lib/services/ai-service";
import { summarizeContent } from "@/lib/services/gemini";
import { NextRequest, NextResponse } from "next/server";

// POST - Create new summary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, content } = body;
    if (!userId || !content) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 },
        );
    }
         
    const result = await AIService.summarizeContent(userId, content);

     if (!result.success) {
       return NextResponse.json(
         { error: result.error },
         { status: 500 }
       );
     }

     return NextResponse.json(result);
  } catch (error) {
    console.error("Error in AI summary API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET - Get summaries history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const history = await AIService.getSummariesHistory(userId, limit);
    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("Error fetching summaries history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
