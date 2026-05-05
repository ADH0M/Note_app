"use server";

import prisma from "@/lib/db/db-connection";
import { revalidatePath } from "next/cache";
import { getSession } from "./session";


export async function deleteUser(userId: string) {
  const session = await getSession();
  const role = session?.role;

  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.task.deleteMany({ where: { userId } });
    await prisma.column.deleteMany({ where: { id:userId } });
    
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw new Error("Failed to delete user");
  }
}

export async function updateUserRole(userId: string, newRole: "admin" | "customer") {
  const session = await getSession();
  const role = session?.role;

  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { type: newRole },
    });
    revalidatePath("/admin");
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw new Error("Failed to update user role");
  }
}
