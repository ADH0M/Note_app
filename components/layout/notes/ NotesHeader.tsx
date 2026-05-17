/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileTextIcon, StarIcon, TagIcon, UsersIcon } from "lucide-react";

import { NotesStatsCard } from "./NotesStatsCard";

interface Props {
  notes: any[];
}

export function NotesHeader({ notes }: Props) {
  const totalNotes = notes.length;

  const meetingNotes = notes.filter((note) => note.meetingDate).length;

  const favorites = notes.filter((note) => note.favorite).length;

  const tags = new Set(notes.flatMap((note) => note.tags || [])).size;

  return (
    <div className="space-y-8 mb-8">
      {/* header */}
      <div className="space-y-3">
        <h1
          className=" text-4xl font-bold tracking-tight text-foreground
          "
        >
          Notes Workspace
        </h1>

        <p
          className=" max-w-xl text-sm leading-7 text-muted-foreground
          "
        >
          Organize your thoughts, meeting discussions, documentation, ideas, and
          project knowledge in one clean workspace.
        </p>
      </div>

      {/* stats */}
      <div className=" grid  gap-4 grid-cols-2 xl:grid-cols-4 ">
        <NotesStatsCard
          title="Total Notes"
          value={totalNotes}
          icon={FileTextIcon}
        />

        <NotesStatsCard
          title="Meeting Notes"
          value={meetingNotes}
          icon={UsersIcon}
        />

        <NotesStatsCard title="Favorites" value={favorites} icon={StarIcon} />

        <NotesStatsCard title="Tags" value={tags} icon={TagIcon} />
      </div>
      <div className="border border-border " />
    </div>
  );
}
