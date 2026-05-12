"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Plus,
  Trash2,
  Edit2,
  GripVertical,
} from "lucide-react";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import {
  Column,
  Task,
  useCreateTaskMutation,
  useDeleteColumnMutation,
  useUpdateColumnMutation,
} from "@/store/reduxApi/todo";
import { cn } from "@/lib/utils";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";

interface ColumnProps {
  column: Column;
  projectId: string;
  userId: string;
  index: number;
}

const TodoColumn: React.FC<ColumnProps> = ({
  column,
  projectId,
  userId,
  index,
}) => {
  const [createTask] = useCreateTaskMutation();
  const [updateColumn] = useUpdateColumnMutation();
  const [deleteColumn] = useDeleteColumnMutation();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      createTask({
        title: newTaskTitle,
        columnId: column.id,
        projectId: projectId,
        order: column.tasks?.length || 0,
        userId: userId,
      });
      setNewTaskTitle("");
    }
  };

  const handleUpdateColumn = () => {
    if (editedTitle.trim() && editedTitle.trim() !== column.title) {
      updateColumn({ id: column.id, title: editedTitle });
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
  };
  const { ref } = useSortable({ id: column.id, index });

  return (
    <div
      className={cn(
        "flex-1 w-full max-w-full sm:min-w-[300px]  bg-card rounded-lg min-h-full h-full p-3 ",
        "border border-border shadow-sm",
        "flex flex-col  max-h-[calc(100vh-200px)]",
      )}
      ref={ref}
    >
      <div className="mb-3 px-2 pb-2 border-b border-border">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <GripVertical
              className="w-3.5 h-3.5 text-muted-foreground cursor-move"
              onClick={(e) => e.stopPropagation()}
            />
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleUpdateColumn}
                onKeyPress={(e) => e.key === "Enter" && handleUpdateColumn()}
                className="flex-1 px-2 py-0.5 text-sm font-semibold bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
            ) : (
              <h2 className="font-semibold text-sm text-foreground">
                {column.title}
              </h2>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {column.tasks?.length || 0}
          </span>
        </div>

        <div className="flex gap-1 justify-end mt-2  w-full">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => deleteColumn(column.id)}
            className=" hover:bg-destructive/10 rounded-md transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-destructive" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 px-1">
        <DragDropProvider>
          {column.tasks?.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}
        </DragDropProvider>
        {(!column.tasks || column.tasks.length === 0) && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No tasks yet
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Add a task..."
            className="flex-1 px-2 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <Button size="sm" onClick={handleAddTask} variant="default">
            <Plus className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoColumn;
