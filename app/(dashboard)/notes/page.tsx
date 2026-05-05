import prisma from "@/lib/db/db-connection";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createColumn } from "@/lib/actions/notes-action";
import Columns from "@/components/ui/Columns";

async function getData(userId: string) {
  const columns = await prisma.column.findMany({
    where: { id:userId  },
    include: {
      tasks: true,
    },
    orderBy: { order: 'asc' }
  });
  return columns;
}

export default async function NotesPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }

  const columns = await getData(userId);
  return (
    <div className="p-6 h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-accent-foreground">My Notes Board</h1>
      
      {/* Add Column Form */}
      <form action={createColumn.bind(null, 0)} className="mb-8 flex gap-2 max-w-md">
        <input
          type="text"
          name="title"
          placeholder="New Column Name (e.g. To Do)"
          className="flex-1 p-2 border border-border rounded-lg bg-background"
          required
        />
        <button type="submit" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
          Add Column
        </button>
      </form>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto flex gap-6 pb-4 ">
        <Columns columns={columns} />
        {columns.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full h-64 text-muted-foreground border-2 border-dashed border-border rounded-xl">
            <p>No columns yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
