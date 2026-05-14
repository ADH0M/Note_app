import { getProject } from "@/lib/actions/projects";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/session";
import { ProjectActions } from "@/components/ui/ProjectActions";
import TodoPage from "@/components/layout/todo/TodoPage";
import { LayoutGrid } from "lucide-react";
import PorjectOption from "@/components/layout/project/porjectOption";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const userId = session.id;
  if (!userId) {
    redirect("/");
  }

  if (!id) {
    redirect("/projects");
  }

  const project = await getProject(userId, id);

  return (
    <div className="min-h-full  h-full relative w-full p-4 sm:p-6 bg-background overflow-x-hidden overflow-y-auto">
      {/* Header */}
      <header className="">
        <div className="flex items-center justify-end mb-4 w-full">
          <ProjectActions projectId={id} userId={userId} />
        </div>
        <PorjectOption projectId={id} userId={userId} />

        {/* Projects Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <LayoutGrid className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-muted">
              {project?.type || "Board"}
            </h2>
          </div>
        </div>
      </header>
      {project?.id && (
        <div className="w-full max-w-full mb-5">
          <TodoPage
            userId={userId}
            projectId={id}
            projectType={project?.type}
          />
        </div>
      )}
    </div>
  );
}
