/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Sparkles, Clock, Lightbulb, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetUserTasksQuery } from "@/store/reduxApi/ai.api";

interface Suggestion {
  suggestedTime: string;
  tips: string;
}

interface Task {
  id: string;
  title: string;
  content?: string;
}

interface Suggestion {
  suggestedTime: string;
  tips: string;
}

export function TaskSuggestionCard({ userId }: { userId: string }) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  const [loading, setLoading] = useState(false);

  const { data, isLoading, error } = useGetUserTasksQuery(userId);

  const handleGetSuggestion = async (task: Task) => {
    setSelectedTask(task);
    setLoading(true);

    try {
      const req = await fetch("/api/ai/suggestions", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId,
          taskId: task.id,
          taskTitle: task.title,
          taskDescription: task.content || "",
        }),
      });

      const data = await req.json();

      if (!req.ok) {
        console.log("Failed request");
        console.log(data);
        return;
      }

      console.log(data);

      // IMPORTANT
      setSuggestion(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSuggestion(null);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6 h-[650px] lg:h-[450px] overflow-hidden">
      <div className="grid grid-cols-1 grid-rows-2 lg:grid-rows-1 lg:grid-cols-2 gap-6 h-full">
        {/* Tasks List */}
        <div className="bg-card border border-border rounded-lg shadow-sm h-full overflow-hidden">
          <h3 className="font-bold text-lg flex p-4 items-center bg-accent gap-2">
            <Target className="w-5 h-5 text-primary" />
            Your Tasks
          </h3>

          <div className="space-y-2 overflow-y-auto h-[90%] py-2 px-4">
            {/* Loading Skeleton */}
            {isLoading && (
              <div className="animate-pulse space-y-3">
                {[...Array(5)].map((_, ind) => (
                  <div
                    key={ind}
                    className="w-full rounded-lg border border-border p-3 space-y-2"
                  >
                    <div className="h-4 bg-muted rounded w-3/4" />

                    <div className="h-3 bg-muted rounded w-full" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-sm text-destructive py-4">
                Failed to load tasks.
              </div>
            )}

            {/* Empty State */}
            {!isLoading && data?.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-6">
                No tasks found
              </div>
            )}

            {/* Tasks */}
            {data &&
              data.map((task: Task) => (
                <button
                  key={task.id}
                  disabled={loading}
                  onClick={() => handleGetSuggestion(task)}
                  className={cn(
                    "w-full text-left px-3 py-3 rounded-lg border transition-all duration-200",
                    selectedTask?.id === task.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 hover:bg-muted/40",
                    loading && "opacity-70 cursor-not-allowed",
                  )}
                >
                  <p className="text-foreground text-sm font-medium">
                    {task.title}
                  </p>

                  {task.content && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {task.content}
                    </p>
                  )}
                </button>
              ))}
          </div>
        </div>

        {/* AI Suggestion */}
        <div className="bg-card border border-border rounded-lg shadow-sm h-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-accent">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Insights
            </h3>

            {loading && <Clock className="w-4 h-4 animate-spin text-primary" />}
          </div>

          {/* Suggestion Content */}
          {suggestion ? (
            <div className="flex flex-col flex-1 p-4 gap-4 overflow-hidden">
              {/* Suggested Time */}
              <div className="px-4 py-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />

                  <span className="text-sm font-semibold text-foreground">
                    Suggested Time
                  </span>
                </div>

                <p className="text-chart-2 text-sm mt-1">
                  {suggestion.suggestedTime}
                </p>
              </div>

              {/* Productivity Tips */}
              <div className="flex-1 p-4 bg-muted rounded-lg overflow-y-auto">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />

                  <span className="text-sm font-semibold text-foreground">
                    Productivity Tips
                  </span>
                </div>

                {suggestion.tips
                  .split(/\d+\.\s/)
                  .filter(Boolean)
                  .map((text, ind) => (
                    <p
                      className="text-sm text-foreground whitespace-pre-wrap leading-relaxed"
                      key={ind}
                    >
                      <span className="text-xl">{ind + 1}. </span>
                      {text}
                    </p>
                  ))}
              </div>

              {/* Clear Button */}
              <Button
                onClick={handleClear}
                variant="outline"
                className="w-full"
              >
                Clear & Select Another Task
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-center px-6 text-muted-foreground">
              <Sparkles className="w-12 h-12 mb-3 opacity-30" />

              <p className="font-medium">
                Select a task to get AI-powered suggestions
              </p>

              <p className="text-sm mt-2">
                Get the best working time and productivity tips for your task
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
