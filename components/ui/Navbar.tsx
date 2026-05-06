"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import UserModal, { IControler } from "./UserModal";
import { useDispatchHook } from "@/hooks/useSelector";
import { fetchUser } from "@/store/reducers/auth";

const links = [
  { path: "/", title: "Home", id: "8home8ii" },
  { path: "/notes", title: "Notes", id: "notes08ii" },
];

type User = {
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  role: string | undefined;
} | null;

export default function Navbar({ user }: { user?: User }) {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const openModal = useRef<IControler | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const userRole = ["admin", "customer"];

  const dispatch = useDispatchHook();
  useEffect(() => {
    if (user?.email && user.id) {
      dispatch(fetchUser({ userId: user?.id, email: user?.email }));
    }
  }, [dispatch, user?.email, user?.id]);

  return (
    <nav className="sticky top-0 left-0 z-50 bg-sidebar border-b border-sidebar backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <UserModal ref={openModal} user={user}>
                <span
                  onClick={() => {
                    openModal.current?.open();
                  }}
                  className="text-xs text-secondary flex justify-center items-center  w-10 h-10 bg-accent rounded-full border border-accent-foreground cursor-pointer"
                >
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              </UserModal>
            )}

            {links.map((link) => {
              return (
                <Link
                  key={link.id}
                  href={link.path}
                  className={`font-normal text-sm ${
                    pathname === link.path ? "border border-primary  " : ""
                  } rounded-md px-2 p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
                >
                  {link.title}
                </Link>
              );
            })}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`font-normal text-sm ${
                  pathname === "/admin" ? "border border-primary  " : ""
                } rounded-md px-2 p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
              >
                Dashboard
              </Link>
            )}

            {userRole.includes(user?.role || "") && (
              <Link
                href="/projects"
                className={`font-normal text-sm ${
                  pathname === "/projects" ? "border border-primary  " : ""
                } rounded-md px-2 p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
              >
                Projects
              </Link>
            )}

            {userRole.includes(user?.role || "") && (
              <Link
                href="/user-dashboard"
                className={`font-normal text-sm ${
                  pathname === "/user-dashboard" ? "border border-primary  " : ""
                } rounded-md px-2 p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
              >
                User Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-md"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Logo */}
          <div className="shrink-0 flex gap-2">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 dark:text-white"
            >
              ogo
            </Link>

            {/* Dark Mode Toggle */}
            <select
              name="select-item"
              id="mean-select"
              onChange={handleChange}
              value={theme}
              className=" border border-border rounded-md text-sm p-1"
            >
              <option value="dark" className="text-primary">
                dark
              </option>
              <option value="light" className="text-primary">
                light
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <div className="px-4 pt-2 pb-3 space-y-3 sm:px-6">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.path}
                className={`block py-2 text-gray-700 hover:text-gray-900 
                    dark:text-gray-300 dark:hover:text-white
                     font-medium   ${
                       pathname === link.path
                         ? "border-b border-primary "
                         : "border-b border-accent-foreground "
                     }
                     dark:border-gray-800`}
                onClick={toggleMenu}
              >
                {link.title}
              </Link>
            ))}

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className={`block py-2 text-gray-700 hover:text-gray-900 
                dark:text-gray-300 dark:hover:text-white
                 font-medium   ${
                   pathname === "/admin"
                     ? "border-b border-primary "
                     : "border-b border-accent-foreground "
                 }
                 dark:border-gray-800`}
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
            )}

            <div className="py-2 border-b border-gray-100 dark:border-gray-800">
              {/* Dark Mode Toggle */}
              <select
                name="select-item"
                id="mean-select"
                onChange={handleChange}
                value={theme}
                className="bg-transparent border border-border rounded-md text-sm p-1 w-full"
              >
                <option value="dark">dark</option>
                <option value="light">light</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col space-y-3">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium rounded-lg"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                    onClick={toggleMenu}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="py-2 text-center">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
