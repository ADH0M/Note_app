/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import NewProjectBtn from "../NewProjectBtn";
import ProjectCard from "./ProjectCard";
import { useSelectorHook } from "@/hooks/useSelector";
import { FiFolder } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { DragDropProvider } from "@dnd-kit/react";
import { PointerSensor, PointerActivationConstraints } from "@dnd-kit/dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Propstype = {
  search: string;
  filter: string;
  userId: string;
  order: number;
  setEditingId: (s: string) => void;
  setEditTitle: (s: string) => void;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<string | null>>;
};
const ProjectList = ({
  search,
  filter,
  userId,
  order,
  setEditingId,
  setEditTitle,
  setDeleteConfirm,
}: Propstype) => {
  const router = useRouter();

  const {
    data: projects,
    error,
    loading,
    errorMsg,
  } = useSelectorHook((s) => s.projectReducer);

  const filteredProjects = projects?.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <div className="text-center py-16 mx-2 sm:mx-10 rounded-xl border-2 border-dashed border-border">
        <MdErrorOutline size={28} className="mx-auto  text-destructive mb-4" />
        <p className=" mb-4 text-destructive">{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredProjects?.length === 0 ? (
        <div className="text-center py-16 mx-2 max-w-full w-full sm:mx-10 rounded-xl border-2 border-dashed border-border">
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
        <div className="max-w-full w-full">
          <DragDropProvider
            onDragEnd={async (e) => {
              if (e.canceled) return;
              if (e.operation.target) {
                const ind = filteredProjects?.findIndex(
                  (p) => p.id === e.operation.target?.id,
                );

                if ("index" in e.operation.target) {
                  console.log(ind, e.operation.target.index);

                  if (ind === e.operation.target.index) return;
                  const index = e.operation.target.index;
                  const id = e.operation.target.id;

                  const reorder = async () => {
                    const req = await fetch(`/api/projects/reorder/${id}`, {
                      method: "POST",
                      body: JSON.stringify({ newIndex: index, userId }),
                    });
                    if (req.ok) {
                      toast.success("Project order updated successfully", {
                        position: "bottom-right",
                      });
                      router.refresh();
                    } else {
                      const err = await req.json();
                      toast.error(err.error, { position: "bottom-right" });
                    }
                  };

                  await reorder();
                }
              }
            }}
            sensors={(defaults) => [
              ...defaults.filter((sensor) => sensor !== PointerSensor),
              PointerSensor.configure({
                activationConstraints: [
                  // Drag starts after the pointer moves 8px
                  new PointerActivationConstraints.Distance({ value: 8 }),
                  // ...or after holding for 200ms with up to 10px tolerance
                  new PointerActivationConstraints.Delay({
                    value: 200,
                    tolerance: 10,
                  }),
                ],
              }),
            ]}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
              {filteredProjects?.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => {
                    setEditingId(project.id);
                    setEditTitle(project.title);
                  }}
                  onDelete={() => setDeleteConfirm(project.id)}
                  index={index}
                />
              ))}
            </div>
          </DragDropProvider>
        </div>
      )}
    </div>
  );
};
export default ProjectList;
