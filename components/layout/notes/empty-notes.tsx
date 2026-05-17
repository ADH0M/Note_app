
export default function EmptyNotes() {
  return (
    <div
      className="
      flex
      min-h-[400px]
      flex-col
      items-center
      justify-center
      rounded-2xl
      border
      border-dashed
      border-border
      bg-card
      p-10
      text-center
      "
    >
      <h3
        className="
        text-lg
        font-semibold
        text-foreground
        "
      >
        No Notes Yet
      </h3>

      <p
        className="
        mt-2
        max-w-sm
        text-sm
        leading-6
        text-muted-foreground
        "
      >
        Create your first note to start
        organizing ideas, meetings, and
        project documentation.
      </p>
    </div>
  );
}