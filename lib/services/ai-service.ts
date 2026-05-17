/* eslint-disable @typescript-eslint/no-explicit-any */
import { AiFeature } from "@/generated/prisma";
import prisma from "../db/db-connection";
import { getTaskAISuggestion, summarizeContent, getDailyPlan } from "./gemini";

export class AIService {
  // Track analytics
  static async trackAnalytics(
    userId: string,
    feature: AiFeature,
    tokensUsed: number,
    responseTime: number,
    success: boolean,
  ) {
    try {
      await prisma.aIAnalytics.create({
        data: {
          userId,
          feature,
          tokensUsed,
          responseTime,
          success,
        },
      });
    } catch (error) {
      console.error("Failed to track analytics:", error);
    }
  }

  // Get suggestions for a task
  static async getTaskSuggestion(
    userId: string,
    taskId: string,
    taskTitle: string,
    taskDescription?: string,
  ) {
    const startTime = Date.now();

    try {
      const suggestion = await getTaskAISuggestion(taskTitle, taskDescription);

      const savedSuggestion = await prisma.aITaskSuggestion.create({
        data: {
          taskTitle,
          taskDescription,
          suggestedTime: suggestion.suggestedTime,
          tips: suggestion.tips,
          userId,
          taskId,
        },
      });

      await this.trackAnalytics(
        userId,
        "suggestion",
        0,
        Date.now() - startTime,
        true,
      );

      return { success: true, data: {suggestion}, saved: savedSuggestion };
    } catch (error) {
      await this.trackAnalytics(
        userId,
        "suggestion",
        0,
        Date.now() - startTime,
        false,
      );
      return { success: false, error: "Failed to get suggestion" };
    }
  }

  // Get suggestions history
  static async getTaskSuggestionsHistory(userId: string, limit: number = 10) {
    return await prisma.aITaskSuggestion.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  // Summarize content
  static async summarizeContent(userId: string, content: string) {
    const startTime = Date.now();

    try {
      const result = await summarizeContent(content);

      const savedSummary = await prisma.aISummary.create({
        data: {
          originalText: content,
          summary: result.summary,
          insights: result.insights,
          userId,
        },
      });

      await this.trackAnalytics(
        userId,
        "summary",
        0,
        Date.now() - startTime,
        true,
      );

      return { success: true, data: result, saved: savedSummary };
    } catch (error) {
      await this.trackAnalytics(
        userId,
        "summary",
        0,
        Date.now() - startTime,
        false,
      );
      return { success: false, error: "Failed to summarize content" };
    }
  }

  // Get summaries history
  static async getSummariesHistory(userId: string, limit: number = 10) {
    return await prisma.aISummary.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  // Get single summary
  static async getSummaryById(userId: string, summaryId: string) {
    return await prisma.aISummary.findFirst({
      where: { id: summaryId, userId },
    });
  }

  // Delete summary
  static async deleteSummary(userId: string, summaryId: string) {
    return await prisma.aISummary.deleteMany({
      where: { id: summaryId, userId },
    });
  }

  // Generate daily plan
  static async generateDailyPlan(
    userId: string,
    tasks: any[],
    userMessage: string,
  ) {
    const startTime = Date.now();

    try {
      const plan = await getDailyPlan(tasks, userMessage);

      const savedPlan = await prisma.aIDailyPlan.create({
        data: {
          plan,
          userMessage,
          tasks: JSON.stringify(tasks),
          userId,
        },
      });

      await this.trackAnalytics(
        userId,
        "plan",
        0,
        Date.now() - startTime,
        true,
      );

      return { success: true, data: plan, saved: savedPlan };
    } catch (error) {
      await this.trackAnalytics(
        userId,
        "plan",
        0,
        Date.now() - startTime,
        false,
      );
      return { success: false, error: "Failed to generate plan" };
    }
  }

  // Get plans history
  static async getPlansHistory(userId: string, limit: number = 10) {
    return await prisma.aIDailyPlan.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit,
    });
  }

  // Get plan by id
  static async getPlanById(userId: string, planId: string) {
    return await prisma.aIDailyPlan.findFirst({
      where: { id: planId, userId },
    });
  }

  // Mark plan as executed
  static async markPlanExecuted(userId: string, planId: string) {
    return await prisma.aIDailyPlan.updateMany({
      where: { id: planId, userId },
      data: { executed: true },
    });
  }

  // Save conversation
  static async saveConversation(userId: string, messages: any[]) {
    const existingConversation = await prisma.aIConversation.findFirst({
      where: { userId },
    });

    if (existingConversation) {
      return await prisma.aIConversation.update({
        where: { id: existingConversation.id },
        data: {
          messages: JSON.stringify(messages),
          updatedAt: new Date(),
        },
      });
    } else {
      return await prisma.aIConversation.create({
        data: {
          userId,
          messages: JSON.stringify(messages),
        },
      });
    }
  }

  // Get conversation
  static async getConversation(userId: string) {
    return await prisma.aIConversation.findFirst({
      where: { userId },
    });
  }

  // Get analytics
  static async getAnalytics(userId: string) {
    const [suggestionsCount, summariesCount, plansCount, avgResponseTime] =
      await Promise.all([
        prisma.aITaskSuggestion.count({ where: { userId } }),
        prisma.aISummary.count({ where: { userId } }),
        prisma.aIDailyPlan.count({ where: { userId } }),
        prisma.aIAnalytics.aggregate({
          where: { userId, success: true },
          _avg: { responseTime: true },
        }),
      ]);

    const recentActivity = await prisma.aIAnalytics.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return {
      totalSuggestions: suggestionsCount,
      totalSummaries: summariesCount,
      totalPlans: plansCount,
      averageResponseTime: avgResponseTime._avg.responseTime || 0,
      recentActivity,
    };
  }
}
