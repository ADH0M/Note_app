/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/actions/session";
import { getDashboardStats, getRecentProjects } from "@/lib/actions/stats";

export default async function UserDashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }
  
  const userId = session.id;
  const stats = await getDashboardStats(userId);
  const recentProjects = await getRecentProjects(userId, 4);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Total Projects</p>
          <p className="text-3xl font-bold">{stats.projects}</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Tasks</p>
          <p className="text-3xl font-bold">{stats.tasks}</p>
        </div>
        <div className="p-6 bg-card rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">Meeting Notes</p>
          <p className="text-3xl font-bold">{stats.notes}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
      {recentProjects.length === 0 ? (
        <p className="text-muted-foreground">No projects yet. Create your first project!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentProjects.map((project: any) => (
            <div key={project.id} className="p-4 bg-card rounded-lg border border-border">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}