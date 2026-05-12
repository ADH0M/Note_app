"use client";

import React, { useState } from "react";
import {
  Calendar,
  Star,
  Flag,
  Edit2,
  Trash2,
  CheckCircle,
  Circle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Task,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/store/reduxApi/todo";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/react/sortable";

interface TaskCardProps {
  task: Task;
  index:number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task ,index }) => {
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const priorityColors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  const handleToggleComplete = () => {
    updateTask({ id: task.id, state: !task.state });
  };

  const handleToggleFavorite = () => {
    updateTask({ id: task.id, favorite: !task.favorite });
  };

  const handleUpdateTitle = () => {
    if (editedTitle.trim() && editedTitle.trim() != task.title) {
      updateTask({ id: task.id, title: editedTitle });
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };
  const {ref} = useSortable({id:task.id ,index})
  return (
    <div
      className={cn(
        "group bg-card rounded-lg p-3 mb-2 transition-all duration-200 cursor-pointer",
        "border border-border hover:border-primary/20",
        "shadow-sm hover:shadow-md",
      )}
      ref={ref}
    >
      <div className="flex items-start gap-2">
        <button
          onClick={handleToggleComplete}
          className="mt-0.5 transition-transform hover:scale-110"
        >
          {task.state ? (
            <CheckCircle className="w-4 h-4 text-primary" />
          ) : (
            <Circle className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyPress={(e) => e.key === "Enter" && handleUpdateTitle()}
              className="w-full px-2 py-1 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
          ) : (
            <p
              className={cn(
                "text-sm",
                task.state && "line-through text-muted-foreground",
              )}
            >
              {task.title}
            </p>
          )}

          {task.content && (
            <p className="text-xs text-muted-foreground mt-1">{task.content}</p>
          )}

          <div className="flex items-center gap-3 mt-2">
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(task.dueDate), "MMM dd")}</span>
              </div>
            )}
            {task.timeSpent > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{task.timeSpent}h</span>
              </div>
            )}
            <div
              className={cn(
                "flex items-center gap-1 text-xs",
                priorityColors[task.priority],
              )}
            >
              <Flag className="w-3 h-3" />
              <span className="capitalize">{task.priority}</span>
            </div>
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={handleToggleFavorite}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <Star
              className={cn(
                "w-3.5 h-3.5 transition-colors",
                task.favorite
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-muted-foreground",
              )}
            />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1 hover:bg-destructive/10 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
