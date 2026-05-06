import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[60px]" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[80%]" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-[60px] rounded-full" />
        <Skeleton className="h-6 w-[80px] rounded-full" />
      </div>
    </div>
  );
}

function TaskItemSkeleton() {
  return (
    <div className="rounded-lg border bg-background p-3 space-y-2">
      <div className="flex items-start gap-2">
        <Skeleton className="h-4 w-4 mt-1 rounded-sm" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-[70%]" />
          <Skeleton className="h-3 w-[40%]" />
        </div>
      </div>
      <div className="flex justify-between items-center ml-6">
        <Skeleton className="h-3 w-[80px]" />
        <Skeleton className="h-6 w-[60px] rounded-full" />
      </div>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-3 w-[80px]" />
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-4 p-2 border-b">
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[80px]" />
        <Skeleton className="h-4 w-[60px]" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-2 border-b">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
      ))}
    </div>
  );
}

function KanbanColumnSkeleton() {
  return (
    <div className="rounded-lg bg-muted/50 p-3 space-y-3 min-w-[280px]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-[100px]" />
        <Skeleton className="h-5 w-6 rounded-full" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <TaskItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-4 max-w-md">
      <Skeleton className="h-4 w-[80px]" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-4 w-[100px]" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-[120px] rounded-md" />
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-[150px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export {
  Skeleton,
  CardSkeleton,
  TaskItemSkeleton,
  ProjectSkeleton,
  TableSkeleton,
  KanbanColumnSkeleton,
  FormSkeleton,
  ProfileSkeleton,
  DashboardSkeleton,
};