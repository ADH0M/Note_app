// components/ai/ProductivityCoach.tsx
'use client';

import { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { getDailyPlan } from '@/lib/services/gemini';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function ProductivityCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Productivity Coach. How are you feeling about your tasks today? Share your thoughts, and I'll help you stay focused and motivated! 🎯",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       type: 'user',
//       content: input,
//       timestamp: new Date(),
//     };
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);

//     try {
//       // Mock tasks - in real app, fetch from your task store
//       const mockTasks = [
//         { title: 'Complete project', priority: 'high', status: 'pending' },
//         { title: 'Team meeting', priority: 'medium', status: 'pending' },
//       ];
      
//       const response = await getDailyPlan(mockTasks, input);
      
//       const aiMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'ai',
//         content: response,
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, aiMessage]);
//     } catch (error) {
//       console.error('Failed to get AI response:', error);
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         type: 'ai',
//         content: "I'm having trouble processing your request. Please try again in a moment.",
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">AI Productivity Coach</h3>
            <p className="text-xs text-muted-foreground">Online • Ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.type === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.type === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] p-3 rounded-lg",
                message.type === 'user'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted border border-border"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {message.type === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask for productivity advice, motivation, or task strategies..."
            className="flex-1 px-4 py-2 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <Button 
            // onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}