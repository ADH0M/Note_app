import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}

export function NotesStatsCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-border
      bg-card
      p-5
      transition-colors
      hover:bg-accent/40
      "
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p
            className="
            text-sm
            font-medium
            text-muted-foreground
            "
          >
            {title}
          </p>

          <h3
            className="
            text-3xl
            font-bold
            text-foreground
            "
          >
            {value}
          </h3>
        </div>

        <div
          className="
          flex
          size-11
          items-center
          justify-center
          rounded-xl
          bg-primary/10
          text-primary
          "
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}