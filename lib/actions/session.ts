"use server";

import { cookies } from "next/headers";

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  phone?: string | null;
  role: string;
  iat: number;
  exp: number;
}

export async function createSession(user: {
  id: string;
  username: string;
  email: string;
  phone?: string | null;
  type: string;
}) {
  const expireDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  
  const cookieStore = await cookies();
  
  cookieStore.set("session", JSON.stringify({
    userId: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.type,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expireDate,
  });

  cookieStore.set("userId", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expireDate,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    return null;
  }

  try {
    const parsed = JSON.parse(sessionToken);
    return parsed as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  cookieStore.delete("userId");
  cookieStore.delete("email");
  cookieStore.delete("username");
  cookieStore.delete("role");
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}