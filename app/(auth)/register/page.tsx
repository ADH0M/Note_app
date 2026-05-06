"use client";
import { registerAction } from "@/lib/actions/auth-action";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

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
    initialState
  );

  useEffect(() => {
    if (state.errors?.general) {
      toast.error(state.errors.general);
    }
  }, [state.errors?.general]);

  return (
    <div className="w-full flex flex-col items-center justify-center max-h-screen gap-10 p-4 ">
      <div className="w-full flex justify-center   h-full ">
        <div className="bg-card w-full sm:w-1/2 md:w-1/3 rounded-2xl shadow-xl  overflow-hidden ">
          <div className="bg-linear-to-r from-accent to-accent-foreground p-4 text-card-foreground text-center">
            <h2 className="text-2xl font-bold">Create New Account</h2>
            <p className="mt-2">Fill in the details to create a new account</p>
          </div>

          {state.errors?.general && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4 text-red-700 text-sm">
              {state.errors.general}
            </div>
          )}

          <form
            action={formAction}
            className="p-4  flex justify-center flex-col items-center border border-border"
          >
            {/* Username */}
            <div className="md:w-[90%] w-full  ">
              <label htmlFor="username" className="auth-label ">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="auth-input"
                placeholder="Username"
              />
              <p className="auth-notvalid">
                {state.errors?.username && state.errors.username[0]}
              </p>
            </div>

            {/* Email */}
            <div className="md:w-[90%] w-full">
              <label htmlFor="email" className="auth-label ">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="auth-input"
                placeholder="example@email.com"
              />
              <p className="auth-notvalid">
                {state.errors?.email && state.errors.email[0]}
              </p>
            </div>

            {/* Password */}
            <div className="md:w-[90%] w-full">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="auth-input"
                placeholder="********"
                autoComplete="new-password"
              />
              <p className="auth-notvalid">
                {state.errors?.password && state.errors.password[0]}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="md:w-[90%] w-full">
              <label htmlFor="confirmPassword" className="auth-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="auth-input"
                placeholder="********"
                autoComplete="new-password"
              />

              <p className="auth-notvalid">
                {state.errors?.confirmPassword &&
                  state.errors.confirmPassword[0]}
              </p>
            </div>

            {/* Terms */}
            <div className="flex items-start mb-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="m-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="terms"
                className="mr-2 text-sm text-gray-600 ml-2"
              >
                I agree to the{" "}
                <a href="#" className="text-accent-foreground hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full md:w-[90%] text-sm  bg-linear-to-t from-accent to-accent-foreground 
              text-white rounded-lg py-3 px-4 font-normal hover:bg-accent transition duration-300"
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="mx-2 block">loading create acount</span>
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent-foreground hover:underline font-medium"
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
