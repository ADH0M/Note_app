import { getProject } from "@/lib/actions/projects";
import { getOrCreateDefaultColumns } from "@/lib/actions/projects";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/session";

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
  
  const userId = session.userId;
  
  if (!id) {
    redirect("/projects");
  }
  
  const project = await getProject(userId, id);
  const columns = await getOrCreateDefaultColumns(id);

  const renderComponent = () => {
    switch (project?.type) {
      case "todo":
        return <div>Todo View for: {project?.title}</div>;
      case "project_tracker":
        return <div>Project Tracker View for: {project?.title}</div>;
      case "task_tracker":
        return <div>Task Tracker View for: {project?.title}</div>;
      case "meeting_notes":
        return <div>Meeting Notes View for: {project?.title}</div>;
      default:
        return <div>Project: {project?.title}</div>;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-background">
      {renderComponent()}
    </div>
  );
}