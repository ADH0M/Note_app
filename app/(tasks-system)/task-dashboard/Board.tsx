"use client";
import { useState, DragEvent, useEffect } from "react";
import type { ColumnActionType } from "@/lib/actions/notes-action";

interface Task {
  title: string;
  id: string;
  content: string | null;
  favorite: boolean | null;
  order: number;
  userId: string;
  columnId: string | null;
  createdAt: Date;
  updatedAt: Date;
  state?: boolean;
  projectId?: string;
}

interface ColumnProps {
  title: string;
  headingColor: string;
  tasks: Task[];
  columnId: string;
  columns: ColumnActionType[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnActionType[]>>;
}

interface DropIndicatorProps {
  beforeId: string | null;
  columnId: string;
}

interface AddCardProps {
  columnId: string;
  setColumns: React.Dispatch<React.SetStateAction<ColumnActionType[]>>;
  userId: string;
}

interface NearestIndicatorResult {
  offset: number;
  element: HTMLElement;
}

interface BoardProps {
  initialColumns: ColumnActionType[];
  userId: string;
}

function Board({ initialColumns, userId }: BoardProps) {
  const [columns, setColumns] = useState<ColumnActionType[]>(initialColumns);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      {columns.map((col) => (
        <div key={col.id}>
          <Column
            title={col.title}
            columnId={col.id}
            headingColor="text-neutral-500"
            tasks={col.tasks as Task[]}
            columns={columns}
            setColumns={setColumns}
          />
        </div>
      ))}
      <BurnBarrel setColumns={setColumns} userId={userId} />
    </div>
  );
}

export default Board;

function Column({
  title,
  headingColor,
  tasks,
  columnId,
  columns,
  setColumns,
}: ColumnProps) {
  const [active, setActive] = useState(false);

  const clearHighlights = () => {
    getIndicators().forEach((i) => ((i as HTMLElement).style.opacity = "0"));
  };

  const getNearestIndicator = (
    e: DragEvent,
    indicators: Element[],
  ): NearestIndicatorResult => {
    const DISTANCE_OFFSET = 50;
    return indicators.reduce<NearestIndicatorResult>(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child as HTMLElement };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1] as HTMLElement,
      },
    );
  };

  const getIndicators = (): Element[] => {
    return Array.from(document.querySelectorAll(`[data-column="${columnId}"]`));
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights();
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  function moveTask(
    cols: ColumnActionType[],
    sourceColumnId: string,
    targetColumnId: string,
    taskId: string,
    newIndex: number,
  ): ColumnActionType[] {
    const updatedColumns = cols.map((col) =>
      col.id === sourceColumnId
        ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
        : col,
    );

    const taskToMove = cols
      .find((col) => col.id === sourceColumnId)
      ?.tasks.find((t) => t.id === taskId);

    if (!taskToMove) return updatedColumns;

    const targetColIndex = updatedColumns.findIndex(
      (col) => col.id === targetColumnId,
    );
    if (targetColIndex === -1) return updatedColumns;

    const newTask = { ...taskToMove, columnId: targetColumnId } as Task;
    const targetTasks = [...(updatedColumns[targetColIndex].tasks as Task[])];

    targetTasks.splice(newIndex, 0, newTask);

    updatedColumns[targetColIndex] = {
      ...updatedColumns[targetColIndex],
      tasks: targetTasks,
    };

    return updatedColumns;
  }

  const handleDragEnd = async (e: DragEvent, colId: string | null) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const beforeId = element.dataset.before || "-1";

    const allColumns = columns;
    const sourceColumn = allColumns.find((col) => col.id === sourceColumnId);
    const taskToMove = sourceColumn?.tasks.find((t) => t.id === taskId);

    if (!taskToMove || !colId) return;

    const targetColumn = allColumns.find((col) => col.id === colId);
    if (!targetColumn) return;

    let newIndex: number;
    if (beforeId === "-1") {
      newIndex = (targetColumn.tasks as Task[]).length;
    } else {
      const beforeIndex = (targetColumn.tasks as Task[]).findIndex(
        (t) => t.id === beforeId,
      );
      newIndex = beforeIndex >= 0 ? beforeIndex : (targetColumn.tasks as Task[]).length;
    }

    const updatedColumns = moveTask(
      allColumns,
      sourceColumnId,
      colId,
      taskId,
      newIndex,
    );
    setColumns(updatedColumns);

    try {
      const res = await fetch("/api/tasks/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          newColumnId: colId,
          newIndex,
        }),
      });

      if (!res.ok) {
        setColumns(allColumns);
        const error = await res.json();
        console.error("Reorder failed:", error);
      }
    } catch (error) {
      console.error("Network error:", error);
      setColumns(allColumns);
    }
  };

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">{tasks.length}</span>
      </div>
      <div
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDragEnd(e, tasks[0]?.columnId || columnId)}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={task.columnId || columnId} />
        ))}
        <DropIndicator beforeId={null} columnId={columnId} />
        <AddCard columnId={columnId} setColumns={setColumns} userId={userId} />
      </div>
    </div>
  );
}

function TaskCard({ task, columnId }: { task: Task; columnId: string }) {
  const handleDragStart = (
    e: DragEvent<HTMLDivElement>,
    taskId: string,
    colId: string,
  ) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceColumnId", colId);
  };

  return (
    <>
      <DropIndicator beforeId={task.id} columnId={columnId} />
      <div
        id={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id, columnId)}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{task.title}</p>
      </div>
    </>
  );
}

function DropIndicator({ beforeId, columnId }: DropIndicatorProps) {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={columnId}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
}

function BurnBarrel({
  setColumns,
  userId,
}: {
  setColumns: React.Dispatch<React.SetStateAction<ColumnActionType[]>>;
  userId: string;
}) {
  const [active, setActive] = useState(false);

  const handleDragEnd = async (e: DragEvent) => {
    const taskId = e.dataTransfer.getData("taskId");
    const sourceColumnId = e.dataTransfer.getData("sourceColumnId");

    setColumns((prev) =>
      prev.map((col) =>
        col.id === sourceColumnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col,
      ),
    );
    setActive(false);

    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => setActive(false);

  return (
    <div
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {active ? "Drop to delete" : "🗑️ Burn Barrel"}
    </div>
  );
}

function AddCard({ columnId, setColumns, userId }: AddCardProps) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title: text.trim(),
      content: null,
      favorite: false,
      order: Date.now(),
      userId,
      columnId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col,
      ),
    );

    setText("");
    setAdding(false);
  };

  return adding ? (
    <form onSubmit={handleSubmit} className="mt-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
        placeholder="Add new task..."
        className="w-full rounded border border-violet-400 bg-violet-400/20 p-2 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
      />
      <div className="mt-1.5 flex justify-end gap-1.5">
        <button
          type="button"
          onClick={() => setAdding(false)}
          className="text-xs text-neutral-400 hover:text-neutral-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-violet-500 px-2 py-1 text-xs text-white hover:bg-violet-600"
        >
          Add
        </button>
      </div>
    </form>
  ) : (
    <button
      type="button"
      onClick={() => setAdding(true)}
      className="mt-2 w-full text-left text-xs text-neutral-400 hover:text-neutral-50"
    >
      + Add task
    </button>
  );
}