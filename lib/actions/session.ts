"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

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
  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    role: user.type,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET);

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
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

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  const user = { username: "", id: "", email: "", phone: "", role: "" };
  if (sessionToken) {
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    user.username = payload.username as string;
    user.email = payload.email as string;
    user.phone = payload.phone as string;
    user.role = payload.role as string;
    user.id = payload.userId as string;
  }

  if (!sessionToken) {
    return null;
  }

  try {
    return user;
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

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
