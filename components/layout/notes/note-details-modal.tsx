"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useGetNoteQuery } from "@/store/reduxApi/notes.api";
import { NoteActions } from "./note-actions";
import { NoteEditor } from "./note-editor";

interface Props {
  noteId: string | null;
  onClose: () => void;
}

export function NoteDetailsModal({ noteId, onClose }: Props) {
  const [editMode, setEditMode] = useState(false);

  const { data: note } = useGetNoteQuery(noteId!, {
    skip: !noteId,
  });

  return (
    <Dialog open={!!noteId} onOpenChange={onClose}>
      <DialogTitle className="hidden"></DialogTitle>
      <DialogContent
        className="container max-w-[800px]  h-[700px] bg-card border-border overflow-x-hidden overflow-y-auto
        "
      >
        {note && (
          <>
            <NoteActions
              note={note}
              editMode={editMode}
              setEditMode={setEditMode}
            />

            <NoteEditor note={note} editMode={editMode} setEditMode={setEditMode}/>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
