"use client";

import { useState } from "react";
import { Plus, LayoutGrid, CalendarIcon, Settings, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCreateColumnMutation,
  useGetColumnsQuery,
  useGetProjectsQuery,
} from "@/store/reduxApi/todo";
import TodoColumn from "./Column";
import { DragDropProvider } from "@dnd-kit/react";

export default function TodoPage({
  userId,
  projectId,
  projectType,
}: {
  userId: string;
  projectId: string;
  projectType?: string;
}) {
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const { data: columns, isLoading: columnsLoading } = useGetColumnsQuery(
    projectId || "",
    {
      skip: !projectId,
    },
  );
  const [createColumn] = useCreateColumnMutation();

  const handleCreateColumn = () => {
    if (newColumnTitle.trim() && projectId) {
      createColumn({
        title: newColumnTitle,
        projectId: projectId,
        order: columns?.length || 0,
      });
      setNewColumnTitle("");
    }
  };

  return (
    <main className="h-full min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-5 sm:p-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Build your page
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Organize your tasks, boost productivity
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Calendar
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-muted">
                {projectType || "Board"}
              </h2>
            </div>
          </div>
        </header>

        {/* Board */}
        {projectId ? (
          <section className="w-full h-full ">
            <div className="w-full flex justify-end  mb-4">
              <div className="">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColumnTitle}
                    onChange={(e) => setNewColumnTitle(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleCreateColumn()
                    }
                    placeholder="New column..."
                    className="px-3 py-1.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  />
                  <Button
                    size="sm"
                    onClick={handleCreateColumn}
                    variant="default"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Column
                  </Button>
                </div>
              </div>
            </div>

            {columnsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-muted-foreground">Loading columns...</div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 w-full min-w-full h-[600px] pb-4">
                <DragDropProvider>
                  {columns?.map((column ,index) => (
                    <TodoColumn
                      key={column.id}
                      column={column}
                      projectId={projectId}
                      userId={userId}
                      index={index}
                    />
                  ))}
                </DragDropProvider>
                {(!columns || columns.length === 0) && (
                  <div className="flex items-center justify-center w-full h-64">
                    <div className="text-center text-muted-foreground">
                      <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No columns yet. Create your first column!</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Project Selected
              </h3>
              <p className="text-muted-foreground">
                Select or create a project to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
