"use client";

import { useState } from "react";

import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CreateNotePayload } from "@/type/features/notes/note.types";

interface Props {
  projectId: string;
  userId: string;

  onSubmit: (values: CreateNotePayload) => Promise<void>;

  isLoading?: boolean;
}

export function NoteForm({ projectId, onSubmit, isLoading, userId }: Props) {
  const [values, setValues] = useState<CreateNotePayload>({
    title: "",
    content: "",
    projectId,
    userId,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateNotePayload, string>>
  >({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validateNote(values);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit(values);
    setValues({ title: "", content: "", projectId, userId });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Title</label>

        <input
          value={values.title}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          placeholder="Enter note title"
          className="
          h-11
          w-full
          rounded-xl
          border
          border-input
          bg-background
          px-4
          text-sm
          text-foreground
          outline-none
          transition-colors
          placeholder:text-muted-foreground
          focus:border-ring
          "
        />

        {errors.title && (
          <p className="text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Content</label>

        <textarea
          value={values.content}
          onChange={(e) =>
            setValues((prev) => ({
              ...prev,
              content: e.target.value,
            }))
          }
          rows={10}
          placeholder="Write your note..."
          className="
          min-h-[240px]
          w-full
          rounded-xl
          border
          border-input
          bg-background
          px-4
          py-3
          text-sm
          text-foreground
          outline-none
          transition-colors
          placeholder:text-muted-foreground
          focus:border-ring
          resize-none
          "
        />

        {errors.content && (
          <p className="text-sm text-destructive">{errors.content}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
        Create Note
      </Button>
    </form>
  );
}

export function validateNote(values: CreateNotePayload) {
  const errors: Partial<Record<keyof CreateNotePayload, string>> = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }

  if (!values.content.trim()) {
    errors.content = "Content is required";
  }

  if (!values.projectId.trim()) {
    errors.projectId = "Project is required";
  }

  return errors;
}
