/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useCreateNoteMutation } from "@/store/reduxApi/notes.api";
import { NoteForm } from "./NoteForm";



interface Props {
  projectId: string;
  userId :string;
}

export function CreateNoteDialog({
  projectId,
  userId
}: Props) {
  const [createNote, { isLoading }] =
    useCreateNoteMutation();

  async function handleCreate(values: any) {
    try {
      await createNote(values).unwrap();

      toast.success(
        "Note created successfully"
      );
    } catch {
      toast.error("Failed to create note");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-card">
          Create Note
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
        border-border
        bg-card
        sm:max-w-2xl
        "
      >
        <DialogHeader>
          <DialogTitle>
            Create New Note
          </DialogTitle>
        </DialogHeader>

        <NoteForm
          projectId={projectId}
          userId ={userId}
          onSubmit={handleCreate}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}