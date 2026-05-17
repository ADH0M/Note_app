"use client";

import { useEffect, useState } from "react";

import {
  FiFolder,
  FiFileText,
  FiSearch,
  FiClock,
  FiCheckSquare,
} from "react-icons/fi";
import { deleteProjet, getProjects } from "@/lib/actions/projects";
import NewProjectBtn from "@/components/layout/NewProjectBtn";
import { useDispatchHook, useSelectorHook } from "@/hooks/useSelector";
import { toast } from "sonner";
import OnDelete from "@/components/layout/modal/onDelete";
import OnEdit from "@/components/layout/modal/onEdit";
import ProjectList from "@/components/layout/project/ProjectList";
import { userProjects } from "@/store/reducers/project";

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProjectType | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data } = useSelectorHook((state) => state.authReducer);
  const userId = data?.id;
  const dispatch = useDispatchHook();
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
      dispatch(userProjects(userId));
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
    <div className="p-6 max-w-7xl mx-auto overflow-y-auto h-full max-h-screen">
      {/* Header */}
      <div className="flex  w-full md:flex-row items-center  justify-between gap-4 mb-8">
        <div className="flex-1 w-full">
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your projects and tasks
          </p>
        </div>
        <NewProjectBtn
          userId={userId}
          order={order}
          className="bg-primary text-primary-foreground hover:bg-primary/90 
           rounded-lg font-medium flex items-center gap-2 transition-colors"
          align="end"
        />
      </div>

      {/* Search and Filter */}
      <div className="grid  grid-cols-1 lg:grid-cols-3 w-full  max-w-full flex-wrap gap-4 mb-6 sm:mg-8 overflow-hidden">
        <div className="col-span-1 relative   w-full max-w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex-1 col-span-1 lg:col-span-2 w-full  flex flex-wrap lg:flex-nowrap justify-around lg:justify-end  gap-1 sm:gap-2   ">
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
              className={`px-4 py-2 rounded-sm  block text-sm font-normal 
                sm:font-medium whitespace-nowrap
                 transition-colors ${
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

      <ProjectList
        filter={filter}
        search={search}
        order={order}
        setDeleteConfirm={setDeleteConfirm}
        setEditTitle={setEditTitle}
        setEditingId={setEditingId}
        userId={userId}
      />

      {/* Edit Modal */}
      <OnEdit
        editTitle={editTitle}
        editingId={editingId}
        setEditTitle={setEditTitle}
        setEditingId={setEditingId}
        userId={userId}
      />
      {/* Delete Confirmation */}
      <OnDelete
        deleteConfirm={deleteConfirm}
        handleDelete={handleDelete}
        setDeleteConfirm={setDeleteConfirm}
      />
    </div>
  );
}
