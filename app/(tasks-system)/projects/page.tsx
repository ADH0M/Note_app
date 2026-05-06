"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiFolder,
  FiList,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiMoreVertical,
  FiClock,
  FiCheckSquare,
} from "react-icons/fi";
import { deleteProjet, getProjects } from "@/lib/actions/projects";
import NewProjectBtn from "@/components/layout/NewProjectBtn";
import { useSelectorHook } from "@/hooks/useSelector";
import { CardActions } from "@/components/ui/action";
import { toast } from "sonner";

type ProjectType =
  | "todo"
  | "project_tracker"
  | "meeting_notes"
  | "task_tracker";

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

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProjectType | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data } = useSelectorHook((state) => state.authReducer);
  const userId = data?.id;

  const projectStore = useSelectorHook((state) => state.projectReducer);
  let order = 1000;
  if (projectStore.data && projectStore.data.length) {
    order =
      Number(projectStore.data[projectStore.data?.length - 1]?.order) || 1000;
  }

  useEffect(() => {
    if (userId) {
      loadProjects();
    }
  }, [userId]);

  const loadProjects = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getProjects(userId);
      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!userId) return;
    try {
      await deleteProjet(userId, projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
      setDeleteConfirm(null);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleProjectCreated = () => {
    loadProjects();
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Please log in to view your projects.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your projects and tasks
          </p>
        </div>
        <NewProjectBtn
          userId={userId}
          order={order}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          align="end"
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(
            [
              "all",
              "todo",
              "project_tracker",
              "meeting_notes",
              "task_tracker",
            ] as const
          ).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "all" ? "All" : projectTypeLabels[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 rounded-xl border-2 border-dashed border-border">
          <FiFolder className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            {search || filter !== "all"
              ? "No projects match your search"
              : "No projects yet. Create your first project!"}
          </p>
          {!search && filter === "all" && (
            <NewProjectBtn
              userId={userId}
              order={order}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={() => {
                setEditingId(project.id);
                setEditTitle(project.title);
              }}
              onDelete={() => setDeleteConfirm(project.id)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Project</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border border-border rounded-lg bg-background mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement update
                  setEditingId(null);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Delete Project</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const typeInfo = projectTypeLabels[project.type] || {
    label: project.type,
    icon: <FiFolder />,
    color: "text-gray-500",
  };

  return (
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
            
              <CardActions onDelete={onDelete} onEdit={onEdit}/>
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
  );
}
