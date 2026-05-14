"use client";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Settings } from "lucide-react";
import React, { useState } from "react";
import { CreateNoteDialog } from "../notes/create-note-dialog";

interface PorpType {
  projectId: string | null;
  userId: string | null;
}
const PorjectOption = ({ projectId, userId }: PorpType) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Build your page
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Organize your tasks, boost productivity
        </p>
      </div>
      <div className="flex gap-2 h-10">
        {open && (
          <>
            <Button variant="ghost" size="sm">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Calendar
            </Button>
            {projectId && userId && (
              <CreateNoteDialog projectId={projectId} userId={userId} />
            )}
          </>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PorjectOption;
