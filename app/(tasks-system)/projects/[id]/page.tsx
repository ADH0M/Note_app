import { getProject } from "@/lib/actions/projects";
import { getOrCreateDefaultColumns } from "@/lib/actions/projects";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/session";
import { ProjectActions } from "@/components/ui/ProjectActions";

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
  
  if (!id) {
    redirect("/projects");
  }

  const project = await getProject(userId, id);
  const columns = await getOrCreateDefaultColumns(id);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background">
      

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{project?.title}</h1>
         <ProjectActions projectId={id} /> 
      </div>
      <p className="text-muted-foreground">Project Type: {project?.type}</p>
    </div>
  );
}
