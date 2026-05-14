"use client";

import { NotesGrid } from "@/components/layout/notes/notes-grid";
import { useGetNotesQuery } from "@/store/reduxApi/notes.api";
import { Loader2Icon } from "lucide-react";
import { NotesHeader } from "./ NotesHeader";

export function NotesPageView() {
  const { data, isLoading, isError } = useGetNotesQuery({});

  if (isLoading) {
    return (
      <div
        className="
        flex
        min-h-[400px]
        items-center
        justify-center
        "
      >
        <Loader2Icon
          className="
          size-6
          animate-spin
          text-muted-foreground
          "
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="
        flex
        min-h-[400px]
        items-center
        justify-center
        rounded-2xl
        border
        border-border
        bg-card
        "
      >
        <p className="text-muted-foreground">Failed to load notes</p>
      </div>
    );
  }

  return (
    <>
      <NotesHeader notes={data} />
      <NotesGrid notes={data || []} />
    </>
  );
}
