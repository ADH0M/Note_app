import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

const model = "gemma-4-26b-a4b-it";
const secondary_modal = "gemini-3-flash-preview";
export const geminiModel = ai.models.get({ model });

export interface AISuggestion {
  suggestedTime: string;
  tips: string;
}

export async function getTaskAISuggestion(
  taskTitle: string,
  taskDescription?: string,
): Promise<AISuggestion> {
  const prompt = `Task: ${taskTitle}\nDescription: ${taskDescription || "No description"}\n\nSuggest the best time of day to do this task and provide 2-3 productivity tips. Return only a JSON object with keys "suggestedTime" (string) and "tips" (string).`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedTime: { type: Type.STRING },
          tips: { type: Type.STRING },
        },
        required: ["suggestedTime", "tips"],
      },
    },
  });

  try {
    if (!response.text) return { suggestedTime: "", tips: "" };
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse AI suggestion", e);
    return {
      suggestedTime: "Flexible",
      tips: "Stay focused and break it into small steps.",
    };
  }
}

export async function summarizeContent(
  content: string,
): Promise<{ summary: string; insights: string[] }> {
  const prompt = `Summarize the following content and extract 3-5 key insights. Content:\n\n${content}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          insights: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["summary", "insights"],
      },
    },
  });

  try {
    if (response.text) return JSON.parse(response.text.trim());
    return { insights: [""], summary: "" };
  } catch (e) {
    console.error("Failed to parse summary", e);
    return {
      summary: content.substring(0, 500) + "...",
      insights: ["Failed to extract insights"],
    };
  }
}

export async function getDailyPlan(
  tasks: { title: string; priority: string; status: string }[],
  userMessage: string,
): Promise<string> {
  const tasksStr = tasks
    .map((t) => `- ${t.title} (${t.priority}, ${t.status})`)
    .join("\n");
  const prompt = `You are a personal productivity coach. Here are the user's tasks for today:\n${tasksStr}\n\nThe user says: "${userMessage}"\n\nProvide a helpful, motivating daily plan or advice.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text || "I'm sorry, I couldn't generate a plan right now.";
}
