import { getColumnsAction } from "@/lib/actions/notes-action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Board from "./Board";

export default async function TaskDashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  
  if (!userId) {
    redirect("/login");
  }
  
  const columns = await getColumnsAction(userId);
  
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50">
      <Board initialColumns={columns} userId={userId} />
    </div>
  );
}