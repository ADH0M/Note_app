"use client";
import { Prisma } from "@/generated/prisma";
import { createTask } from "@/lib/actions/notes-action";
import TaskCard from "./TaskCard";
import { useMemo } from "react";

type ColumnWithTasks = Prisma.ColumnGetPayload<{
  include: { tasks: true };
}>;

const Tasks = ({ column }: { column: ColumnWithTasks }) => {
  const tasksIds = useMemo(() => {
    return column.tasks.map((task) => task.id);
  }, [column.tasks]);

  let lastOrder =
    column.tasks.length > 0 ? Math.max(...column.tasks.map((t) => t.order)) : 0;

  // Ensure lastOrder is a number and increment
  lastOrder = ((lastOrder || 0) + 1) as number;

  return (
    <>
      <div className="p-4 max-h-fit overflow-y-auto space-y-3 min-h-[100px]">
        <>
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </>

        {column.tasks.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-4 italic">
            No tasks yet
          </p>
        )}
      </div>

      <div className="p-4 border-t border-border bg-muted/10">
        <form
          action={createTask.bind(null, {
            order: lastOrder,
            projectId: column.projectId,
          })}
          className="flex gap-2"
        >
          <input type="hidden" name="columnId" value={column.id} />
          <input
            type="text"
            name="title"
            placeholder="Add a task..."
            className="flex-1 p-2 text-sm border border-border rounded-md bg-background"
            required
          />
          <button
            type="submit"
            className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default Tasks;
