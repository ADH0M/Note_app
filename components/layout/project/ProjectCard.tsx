import type { ProjectType } from "@/generated/prisma";
import { CardActions } from "@/components/ui/action";
import {
  FiCheckSquare,
  FiClock,
  FiFileText,
  FiFolder,
  FiList,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/react/sortable";

const projectTypeLabels: Record<
  ProjectType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  todo: { label: "Todo", icon: <FiCheckSquare />, color: "text-blue-500" },
  project_tracker: {
    label: "Project Tracker",
    icon: <FiFolder />,
    color: "text-purple-500",
  },
  meeting_notes: {
    label: "Meeting Notes",
    icon: <FiFileText />,
    color: "text-green-500",
  },
  task_tracker: {
    label: "Task Tracker",
    icon: <FiClock />,
    color: "text-orange-500",
  },
};

interface Project {
  id: string;
  title: string;
  type: ProjectType;
  order: number;
  userId: string;
  createdAt: string;
  _count?: {
    tasks: number;
    notes: number;
  };
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
  index,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}) {
  const router = useRouter();
  const typeInfo = projectTypeLabels[project.type] || {
    label: project.type,
    icon: <FiFolder />,
    color: "text-gray-500",
  };

  const { ref } = useSortable({ id: project.id, index });

  return (
    <div className="w-full max-w-full sm:max-w-[400px] " ref={ref}>
      <div
        className="group p-5 rounded-xl border border-border bg-card text-card-foreground hover:border-primary/50 transition-all cursor-pointer"
         onClick={() => router.push(`/projects/${project.id}`)}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={`p-2 rounded-lg bg-muted ${typeInfo.color}`}>
            {typeInfo.icon}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
          >
            <div className="relative">
              <CardActions onDelete={onDelete} onEdit={onEdit} />
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{typeInfo.label}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FiList size={14} />
            <span>{project._count?.tasks || 0} tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <FiFileText size={14} />
            <span>{project._count?.notes || 0} notes</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          {new Date(project.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default ProjectCard;
