"use client";
import { registerAction } from "@/lib/actions/auth-action";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const initialState: {
  message: string;
  errors?: {
    username?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string;
  };
} = { message: "" };

export default function Signup() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  useEffect(() => {

    if (state.errors?.general) {
      toast.error(state.errors.general);
    }else{
      toast.success('creaet new account succesfull ')
    }
  }, [state.errors?.general]);

  return (
    <div
      className=" overflow-auto h-full w-full flex flex-col items-center 
    overflow-y-auto
    justify-center bg-accent p-4"
    >
      <div className="w-full flex justify-center h-full   ">
        <div
          className="bg-card h-full w-full sm:w-[500px]  rounded-lg shadow-sm border
         border-border overflow-hidden"
        >
          {/* Header */}
          <div
            className="bg-linear-to-r from-primary/10 to-primary/5 p-6 
          border-b border-border"
          >
            <h2 className="text-2xl font-bold font-serif text-foreground">
              Create New Account
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Fill in the details to create a new account
            </p>
          </div>

          {/* General Error */}
          <div className="h-8">
            {state.errors?.general && (
              <div className="h-full bg-destructive/10 border-l-4  border-destructive p-3 mx-6 mt-2 rounded">
                <p className="text-destructive text-xs">
                  {state.errors.general}
                </p>
              </div>
            )}
          </div>

          {/* Form */}
          <form action={formAction} className="px-6 pb-2 pt-1 space-y-2">
            {/* Username */}
            <div className="space-y-1">
              <label
                htmlFor="username"
                className="text-xs font-medium text-foreground"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={cn(
                  "w-full px-3 py-2 bg-background border border-border rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "text-foreground placeholder:text-muted-foreground transition-colors",
                  state.errors?.username &&
                    "border-destructive focus:ring-destructive",
                )}
                placeholder="johndoe"
              />
              {state.errors?.username && (
                <p className="text-xs text-destructive">
                  {state.errors.username[0]}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-xs font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={cn(
                  "w-full px-3 py-2 bg-background border border-border rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "text-foreground placeholder:text-muted-foreground transition-colors",
                  state.errors?.email &&
                    "border-destructive focus:ring-destructive",
                )}
                placeholder="hello@example.com"
              />
              {state.errors?.email && (
                <p className="text-xs text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-foreground"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={cn(
                  "w-full px-3 py-2 bg-background border border-border rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "text-foreground placeholder:text-muted-foreground transition-colors",
                  state.errors?.password &&
                    "border-destructive focus:ring-destructive",
                )}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {state.errors?.password && (
                <p className="text-xs text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-foreground"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={cn(
                  "w-full px-3 py-2 bg-background border border-border rounded-md",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "text-foreground placeholder:text-muted-foreground transition-colors",
                  state.errors?.confirmPassword &&
                    "border-destructive focus:ring-destructive",
                )}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {state.errors?.confirmPassword && (
                <p className="text-xs text-destructive">
                  {state.errors.confirmPassword[0]}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center gap-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-2 bg-background"
              />
              <label htmlFor="terms" className="text-xs text-muted-foreground">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-primary hover:underline transition-colors"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full bg-primary text-primary-foreground rounded-lg py-2.5 px-4",
                "font-medium text-xs transition-colors",
                "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2",
              )}
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium transition-colors"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
