"use client";

import { CalendarDaysIcon } from "lucide-react";

interface Props {
  note: {
    id: string;
    title: string;
    content: string;

    tags?: string[];

    createdAt: string;
  };
  onClick: () => void;
}

export function NoteCard({ note ,onClick }: Props) {
  return (
    <div
      className="
      group
      rounded-2xl
      border
      border-border
      bg-card
      p-5
      transition-all
      hover:bg-accent/40
      "
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h3
            className="
            line-clamp-1
            text-base
            font-semibold
            text-card-foreground
            "
          >
            {note.title}
          </h3>

          <p
            className="
            line-clamp-4
            text-sm
            leading-6
            text-muted-foreground
            "
          >
            {note.content}
          </p>
        </div>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="
                  rounded-full
                  bg-accent
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-accent-foreground
                  "
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div
          className="
          flex
          items-center
          justify-between
          border-t
          border-border
          pt-4
          "
        >
          <div
            className="
            flex
            items-center
            gap-2
            text-xs
            text-muted-foreground
            "
          >
            <CalendarDaysIcon className="size-4" />

            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
