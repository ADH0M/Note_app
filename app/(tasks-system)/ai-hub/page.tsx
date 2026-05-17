/* eslint-disable @typescript-eslint/no-explicit-any */
// app/ai-hub/page.tsx
"use client";

import { useState } from "react";
import {
  Sparkles,
  Calendar,
  Lightbulb,
  FileText,
  Brain,
  CheckCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TaskSuggestionCard } from "@/components/layout/ai/TaskSuggestionCard";
import { DailyPlanner } from "@/components/layout/ai/DailyPlanner";
import { ContentSummarizer } from "@/components/layout/ai/ContentSummarizer";
import { ProductivityCoach } from "@/components/layout/ai/ProductivityCoach";
import { StatCard } from "@/components/layout/ai/StatCard";
import { useSelectorHook } from "@/hooks/useSelector";
import { toast } from "sonner";

export default function AIHubPage() {
  const { error, loading, data, errorMsg } = useSelectorHook(
    (state) => state.authReducer,
  );

  const [activeTab, setActiveTab] = useState<
    "suggestions" | "summarizer" | "planner" | "coach"
  >("suggestions");

  const tabs = [
    { id: "suggestions", label: "Task Insights", icon: Lightbulb },
    { id: "summarizer", label: "Smart Summary", icon: FileText },
    { id: "planner", label: "Daily Plan", icon: Calendar },
    { id: "coach", label: "AI Coach", icon: MessageSquare },
  ];
  if (error && !data) {
    toast.error('try to login again');
    return <div/>
  }
  return (
    <div className="p-4 h-full min-h-full overflow-auto">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-serif italic tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Productivity Hub
          </h1>
        </div>
        <p className="text-sm text-muted-foreground font-mono tracking-wider mt-1 uppercase">
          Intelligent Assistance // Powered by Gemini AI
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-8">
        <StatCard
          icon={Zap}
          label="AI Credits Used"
          value="156"
          change="+12 today"
        />
        <StatCard
          icon={CheckCircle}
          label="Tasks Optimized"
          value="23"
          change="This week"
        />
        <StatCard
          icon={Clock}
          label="Time Saved"
          value="~8h"
          change="Estimated"
        />
        <StatCard
          icon={TrendingUp}
          label="Productivity"
          value="+34%"
          change="Last 7 days"
        />
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border ">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-colors relative",
                  "flex items-center gap-2 rounded-t-lg",
                  activeTab === tab.id
                    ? "text-primary bg-card border border-border border-b-transparent"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[600px] my-4">
        {activeTab === "suggestions" && <TaskSuggestionCard userId={data?.id ||''} />}
        {activeTab === "summarizer" && <ContentSummarizer />}
        {activeTab === "planner" && <DailyPlanner />}
        {activeTab === "coach" && <ProductivityCoach />}
      </div>
    </div>
  );
}
