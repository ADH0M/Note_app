/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { redirect } from "next/navigation";
import prisma from "../db/db-connection";
import bcrypt from "bcryptjs";
import { createSession, destroySession } from "./session";

type SignupFormState = {
  message?: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string;
  };
};

export async function registerAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation
  const errors: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string;
  } = {};

  let hasErrors = false;

  if (!username || username.length < 2) {
    errors.username = ["Username must be at least 2 characters long."];
    hasErrors = true;
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = ["Please enter a valid email address."];
    hasErrors = true;
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters long."];
    hasErrors = true;
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = ["Passwords do not match."];
    hasErrors = true;
  }

  if (hasErrors) {
    return { message: "Validation failed.", errors };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return {
        message: "User already exists.",
        errors: {
          general: "An account with this email already exists.",
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

  } catch (error: any) {
    console.error("Signup error:", error);
    return {
      message: "Something went wrong.",
      errors: {
        general: "Failed to create account. Please try again later.",
      },
    };
  }

  redirect("/login");
}

export async function loginUpAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // Validation
  const errors: {
    email?: string[];
    password?: string[];
    general?: string;
  } = {};

  let hasErrors = false;

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = ["Please enter a valid email address."];
    hasErrors = true;
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters long."];
    hasErrors = true;
  }

  if (hasErrors) {
    return { message: "Validation failed.", errors };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { errors: { general: "Invalid credentials" } };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { errors: { general: "Invalid credentials" } };
    }

    await createSession({
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      type: user.type,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      message: "Something went wrong.",
      errors: {
        general: "Failed to login. Please try again later.",
      },
    };
  }

  redirect("/");
}

export async function logoutAction() {
  try {
    await destroySession();
  } catch (error: any) {
    console.error("Logout error:", error);
  }
  redirect("/login");
}

type ResetRequestState = {
  message?: string;
  errors?: {
    email?: string[];
    general?: string;
  };
};

export async function requestPasswordReset(
  prevState: ResetRequestState,
  formData: FormData
): Promise<ResetRequestState> {
  const email = formData.get("email") as string;

  const errors: {
    email?: string[];
    general?: string;
  } = {};

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = ["Please enter a valid email address."];
    return { message: "Validation failed.", errors };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return { message: "If the email exists, a reset link has been sent." };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordReset.create({
      data: {
        email,
        token,
        expiresAt,
        userId: user.id,
      },
    });

    console.log(`Password reset link: /reset-password?token=${token}`);
    
    return { message: "If the email exists, a reset link has been sent." };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { message: "Something went wrong. Please try again." };
  }
}

export async function resetPassword(token: string, newPassword: string) {
  if (!token || !newPassword || newPassword.length < 6) {
    throw new Error("Invalid token or password");
  }

  try {
    const reset = await prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!reset) {
      throw new Error("Invalid reset token");
    }

    if (reset.expiresAt < new Date()) {
      throw new Error("Reset token has expired");
    }

    if (reset.used) {
      throw new Error("Reset token already used");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: reset.userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { used: true },
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset failed:", error);
    throw error;
  }
}

export async function verifyResetToken(token: string) {
  if (!token) {
    throw new Error("Token required");
  }

  const reset = await prisma.passwordReset.findUnique({
    where: { token },
  });

  if (!reset) {
    throw new Error("Invalid token");
  }

  if (reset.expiresAt < new Date()) {
    throw new Error("Token expired");
  }

  if (reset.used) {
    throw new Error("Token already used");
  }

  return { valid: true, email: reset.email };
}
