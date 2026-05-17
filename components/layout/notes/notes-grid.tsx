import { useState } from "react";
import EmptyNotes from "./empty-notes";
import { NoteCard } from "./note-card";
import { NoteDetailsModal } from "./note-details-modal";

interface Props {
  notes: {
    id: string;
    title: string;
    content: string;
    tags?: string[];

    createdAt: string;
  }[];
}

export function NotesGrid({ notes }: Props) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  if (notes.length === 0) {
    return <EmptyNotes />;
  }

  return (
    <div
      className="
      grid
      gap-5
      sm:grid-cols-2
      xl:grid-cols-3
      "
    >
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => {
            setSelectedNote(note.id);
          }}
        />
      ))}

      <NoteDetailsModal
        noteId={selectedNote}
        onClose={() => setSelectedNote(null)}
      />
    </div>
  );
}
