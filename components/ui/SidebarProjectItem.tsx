"use client";
import { Folder, Calendar, Tag, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChangeEvent, DragEvent, MouseEvent, useState } from "react";
import { useDispatchHook } from "@/hooks/useSelector";
import { reorderProjects, userProjects } from "@/store/reducers/project";
import { Input } from "./input";
import { Label } from "./label";
import ProjectMenu from "../layout/ProjectMenu";
import { deleteProjet, updateProject } from "@/lib/actions/projects";

interface SidebarProjectItemProps {
  id: string;
  userId: string;
  title: string;
  type: string;
  createdAt: string;
  isActive?: boolean;
  order: number;
  handleDragStart?: (e: DragEvent<HTMLDivElement>, id: string) => void;
}

interface SidebarProjectsSectionProps {
  projects: SidebarProjectItemProps[] | null;
  isLoading?: boolean;
}

export function SidebarProjectItem({
  id,
  title,
  userId,
  type,
  createdAt,
  order,
  isActive,
  handleDragStart,
}: SidebarProjectItemProps) {
  const [isUpdate, setIsUpdate] = useState(false);
  const [projectTitle, setProjectTitle] = useState(title);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
  };

  const dispatch = useDispatchHook();
  const handleDelete = async () => {
    await deleteProjet(userId, id);
    dispatch(userProjects(userId));
  };
  const handleUpdate = async (e: MouseEvent<HTMLSpanElement | MouseEvent>) => {
    e.preventDefault();
    if (title === projectTitle) {
      setIsUpdate(false);
      return;
    }
    await updateProject(id, userId!, projectTitle);
    dispatch(userProjects(userId));
    setIsUpdate(false);
  };
  return (
    <>
      <ProjectIndicators
        columnName="user-projects"
        order={order}
        projectId={id}
      />
      <div
        className={`w-full h-full flex justify-center items-center px-3 py-0.5  rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
        onDragStart={(e) => handleDragStart!(e, id)}
      >
        <Link
          href={`/projects/${id}`}
          className={`group flex-1 flex items-center gap-3  `}
          aria-current={isActive ? "page" : undefined}
        >
          <Folder
            className={`h-4 w-4 shrink-0 ${
              isActive
                ? "text-primary-foreground"
                : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
            }`}
          />

          <div className="min-w-0 flex-1">
            {isUpdate ? (
              <Label
                htmlFor="project-title"
                className="text-sm  text-foreground relative"
              >
                <Input
                  id="project-title"
                  value={projectTitle}
                  onChange={handleChange}
                  placeholder="e.g. Review design mockups"
                  className="bg-input border border-red-500 ring-border text-foreground text-xs px-2 h-5 
                  font-extralight outline-none"
                />
                <span
                  className="absolute hover:bg-secondary cursor-pointer hover:text-green-500 right-1 
                top-1/2 -translate-y-1/2 bg-sidebar/90 rounded-2xl"
                  onClick={handleUpdate}
                >
                  <Check size={14} />
                </span>
              </Label>
            ) : (
              <h3 className="text-sm font-medium truncate">{title}</h3>
            )}

            <div className="flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1 text-[11px] opacity-80">
                <Tag className="h-2.5 w-2.5" />
                {type}
              </span>
              <span className="flex items-center gap-1 text-[11px] opacity-80">
                <Calendar className="h-2.5 w-2.5" />
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
        <div className="flex items-center justify-between  rounded-lg ">
          <ProjectMenu setUpdate={setIsUpdate} handleDelete={handleDelete} />
        </div>
      </div>
    </>
  );
}

export function SidebarProjectsSection({
  projects,
  isLoading = false,
}: SidebarProjectsSectionProps) {
  const [drag, setDarg] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatchHook();

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string) => {
    setDarg(true);
    e.dataTransfer.setData("project-id", id);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDarg(true);
    const indecators = getIndecators("user-projects");
    clearIndicators(indecators);
    const element = getNerastIndicator(indecators, e);
    element.style.opacity = "1";
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDarg(false);
  };

  const handleDragEnd = async (e: DragEvent<HTMLDivElement>) => {
    setDarg(false);
    const id = e.dataTransfer.getData("project-id");    
    const indecators = getIndecators("user-projects");
    const element = getNerastIndicator(indecators, e);
    const index = element.dataset.before;
    if (id === index) return;

    clearIndicators(indecators);
    const project = projects?.find((ele) => {
      if (ele.id === id) {
        return ele;
      }
    });
    const findNewIndex = projects?.findIndex((ele) => ele.id === index);
    const copy = projects?.filter((pr) => pr.id !== id);

    if (!id || !index) return;
    if (!project || !copy?.length) return;

    if (index === "-1") {
      copy.push(project);
    } else {
      copy.splice(findNewIndex!, 0, project);
    }

    const req = await fetch("/api/tasks/reorder/project", {
      method: "POST",
      body: JSON.stringify({ newIndex: findNewIndex, projectId: id }),
    });


    dispatch(reorderProjects({ data: copy }));
  };

  const getNerastIndicator = (
    indicators: HTMLDivElement[],
    e: DragEvent<HTMLDivElement>
  ): HTMLDivElement => {
    const Destance_Offset = 50;
    const element = {
      offset: Number.NEGATIVE_INFINITY,
      ele: indicators[indicators.length - 1],
    };

    for (const i of indicators) {
      const { top } = i.getBoundingClientRect();
      const offset = e.clientY - (top + Destance_Offset);
      if (offset > element.offset && offset < 0) {
        element.ele = i;
        element.offset = offset;
      }
    }
    return element.ele;
  };

  const getIndecators = (columnName: string): HTMLDivElement[] => {
    return Array.from(
      document.querySelectorAll(`[data-column='${columnName}']`)
    );
  };

  const clearIndicators = (indecators: HTMLDivElement[]) => {
    indecators.forEach((ele) => {
      ele.style.opacity = "0";
    });
  };

  return (
    <div className="mt-3">
      <div className="px-3 mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Your Projects
        </h3>
      </div>

      <div
        className={`space-y-2 ${drag ? "bg-background/10" : "bg-transparent"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDragEnd(e)}
      >
        {isLoading || !projects ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-accent/10 animate-pulse"
              >
                <div className="h-4 w-4 rounded bg-muted shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-3/4 rounded bg-muted"></div>
                  <div className="flex gap-2">
                    <div className="h-2 w-10 rounded bg-muted/60"></div>
                    <div className="h-2 w-12 rounded bg-muted/60"></div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : projects.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground text-center">
            No projects yet
          </div>
        ) : (
          <>
            {projects.map((pr) => (
              <SidebarProjectItem
                key={pr.id}
                handleDragStart={handleDragStart}
                id={pr.id}
                order={pr.order}
                userId={pr.userId}
                title={pr.title}
                type={pr.type || "Project"}
                createdAt={pr.createdAt}
                isActive={pathname === `/projects/${pr.id}`}
              />
            ))}
            <ProjectIndicators
              columnName="user-projects"
              order={-1}
              projectId="-1"
            />
          </>
        )}
      </div>
    </div>
  );
}

const ProjectIndicators = ({
  projectId,
  order,
  columnName,
}: {
  projectId: string;
  order: number;
  columnName: string;
}) => {
  return (
    <div
      className="h-1 w-full bg-accent rounded-2xl mb-1 opacity-0"
      data-before={projectId}
      data-column={columnName}
      data-order={order}
    />
  );
};
