"use client";
import { loginUpAction } from "@/lib/actions/auth-action";
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
    loginUpAction,
    initialState
  );

  useEffect(() => {
    if (state.errors?.general) {
      toast.error(state.errors.general);
    }
  }, [state.errors?.general]);

  return (
    <div className="w-full flex flex-col items-center justify-center max-h-screen gap-10 p-4    ">
      <div className="w-full flex justify-center items-center   ">
        <div className="bg-card w-full sm:w-3/4 md:w-1/2 lg:w-1/3 rounded-2xl shadow-xl  overflow-hidden ">
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
            className="p-6 h-96  flex justify-center flex-col items-center border border-border"
          >
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

            {/* Submit Button */}
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
                  <span className="mx-2 block">loading-createAcount</span>
                </span>
              ) : (
                "sing up"
              )}
            </button>

            <p className="text-sm text-center text-gray-600">
              Create new account?{" "}
              <Link
                href="/register"
                className="text-accent-foreground hover:underline font-medium"
              >
                register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
