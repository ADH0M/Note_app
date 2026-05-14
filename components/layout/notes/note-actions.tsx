/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TrashIcon, PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDeleteNoteMutation } from "@/store/reduxApi/notes.api";

interface Props {
  note: any;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
}

export function NoteActions({ note, editMode, setEditMode }: Props) {
  const [deleteNote] = useDeleteNoteMutation();

  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <h2 className="text-lg font-semibold text-foreground">{note.title}</h2>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setEditMode(!editMode)}>
          <PencilIcon className="size-4" />
        </Button>

        <Button variant="destructive" onClick={() => deleteNote(note.id)}>
          <TrashIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
