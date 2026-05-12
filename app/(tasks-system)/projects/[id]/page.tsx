import { getProject } from "@/lib/actions/projects";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/session";
import { ProjectActions } from "@/components/ui/ProjectActions";
import TodoPage from "@/components/layout/todo/TodoPage";

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
    <div className="min-h-full h-full w-full p-4 sm:p-6 bg-background overflow-x-hidden overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{project?.title}</h1>
        <ProjectActions projectId={id} />
      </div>
      {/* <p className="text-muted-foreground">Project Type: {project?.type}</p> */}
      <div className="w-full max-w-full mb-5">
        <TodoPage userId={userId} projectId={id} projectType={project?.type}/>
      </div>
    </div>
  );
}
