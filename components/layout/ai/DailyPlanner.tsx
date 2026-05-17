// components/ai/DailyPlanner.tsx
'use client';

import { useState } from 'react';
import { Calendar, Sparkles, CheckCircle, Circle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
// import { getDailyPlan } from '@/lib/services/gemini';

interface TodoTask {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export function DailyPlanner() {
  const [tasks, setTasks] = useState<TodoTask[]>([
    { id: '1', title: 'Finish project report', priority: 'high', status: 'pending' },
    { id: '2', title: 'Team sync meeting', priority: 'medium', status: 'pending' },
    { id: '3', title: 'Code review', priority: 'high', status: 'in-progress' },
    { id: '4', title: 'Update documentation', priority: 'low', status: 'pending' },
  ]);
  const [plan, setPlan] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [userMessage, setUserMessage] = useState('');

//   const handleGeneratePlan = async () => {
//     setLoading(true);
//     try {
//       const tasksForAI = tasks.map(t => ({
//         title: t.title,
//         priority: t.priority,
//         status: t.status,
//       }));
//       const result = await getDailyPlan(tasksForAI, userMessage);
//       setPlan(result);
//     } catch (error) {
//       console.error('Failed to generate plan:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const priorityColors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tasks Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Today&#39;s Tasks
          </h3>
          <span className="text-xs text-muted-foreground">
            {tasks.filter(t => t.status === 'completed').length}/{tasks.length} completed
          </span>
        </div>
        
        <div className="space-y-3 mb-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border"
            >
              <button onClick={() => toggleTaskStatus(task.id)}>
                {task.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <span className={cn(
                "flex-1 text-sm",
                task.status === 'completed' && "line-through text-muted-foreground"
              )}>
                {task.title}
              </span>
              <Flag className={cn("w-3.5 h-3.5", priorityColors[task.priority])} />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <textarea
            placeholder="Optional: Add a message for your AI coach (e.g., 'I'm feeling overwhelmed today' or 'I need motivation')"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="w-full p-3 text-sm outline-none resize-none text-foreground bg-muted rounded-lg border border-border placeholder:text-muted-foreground"
            rows={3}
          />
          
          <Button 
            // onClick={handleGeneratePlan}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Calendar className="w-4 h-4 mr-2" />
            )}
            Generate AI Daily Plan
          </Button>
        </div>
      </div>

      {/* AI Plan Section */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Your Personalized Plan
        </h3>
        
        {plan ? (
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {plan}
              </p>
            </div>
            <Button 
              onClick={() => setPlan('')}
              variant="outline" 
              className="w-full"
            >
              Generate New Plan
            </Button>
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Your AI-generated daily plan will appear here</p>
            <p className="text-sm mt-2">Click &#34;Generate AI Daily Plan&#34; to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}