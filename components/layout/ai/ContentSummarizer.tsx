/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ai/ContentSummarizer.tsx
"use client";
import { useState } from "react";
import { FileText, Sparkles, ChevronRight, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContentSummarizer() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/ai/summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "currentUserId", // Get from your auth context
          content: inputText,
        }),
      });

      //   setSummary(await response.json());
    } catch (error) {
      console.error("Failed to summarize:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (summary?.summary) {
      navigator.clipboard.writeText(summary.summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Content to Analyze
        </h3>

        <textarea
          placeholder="Paste notes, articles, or any text content here for AI-powered summarization and insight extraction..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full h-64 p-4 outline-none resize-none text-foreground bg-muted rounded-lg border border-border placeholder:text-muted-foreground"
        />

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSummarize}
            disabled={!inputText.trim() || loading}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-primary/90"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Extract Intelligence
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Synthesized Results
          </h3>
          {summary && (
            <Button size="sm" variant="ghost" onClick={handleCopy}>
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {summary ? (
          <div className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-foreground leading-relaxed italic">
                {summary.summary}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Key Insights
              </h4>
              {/* {summary.insights.map((insight: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg border border-border"
                >
                  <ChevronRight className="w-4 h-4 mt-0.5 text-primary" />
                  <span className="text-sm text-foreground">{insight}</span>
                </div>
              ))} */}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Your extracted insights will appear here</p>
            <p className="text-sm mt-2">
              Paste content and click &#34;Extract Intelligence&#34;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
