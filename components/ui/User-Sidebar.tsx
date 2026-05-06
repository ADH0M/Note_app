"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  FiHome,
  FiUsers,
  FiPlus,
  FiFileText,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { userProjects } from "@/store/reducers/project";
import { useDispatchHook, useSelectorHook } from "@/hooks/useSelector";
import { Plus, Sidebar } from "lucide-react";
import NewProjectBtn from "../layout/NewProjectBtn";
import { SidebarProjectsSection } from "./SidebarProjectItem";

// أنواع
type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  phone: string;
} | null;

// ========================
// Sidebar (مُحدّث لـ react-icons)
// ========================
function UserSidebar({
  user,
  isOpen,
  toggleSidebar,
}: {
  user?: User;
  isOpen: boolean;
  toggleSidebar: () => void;
}) {

  const { data } = useSelectorHook((state) => state.authReducer);
  const projects = useSelectorHook((state) => state.projectReducer);
  let order = 1000;
  if (projects.data && projects.data.length) {
    order = Number(projects.data[projects.data?.length - 1].order);
  }
  const dispatch = useDispatchHook();

  useEffect(() => {
    if (data?.id) {
      dispatch(userProjects(data?.id));
    }
  }, [dispatch, data]);

  return (
    <aside
      className={`fixed max-h-full h-full md:sticky  md:translate-x-0 z-40  flex 
        flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground
         transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 md:w-64`}
    >
      {/* Close Button for Mobile */}
      <div className="md:hidden p-4 flex justify-end">
        <button
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          className="text-sidebar-foreground bg-transparent hover:text-primary cursor-pointer border-none "
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl bg-sidebar-primary text-sidebar-primary-foreground">
            T
          </div>
          <span className="text-xl text-sidebar-foreground font-bold">
            TaskFlow
          </span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b bg-sidebar border-sidebar-border">
        <div className="space-y-2">
          <p className="font-semibold truncate text-sidebar-foreground">
            {user?.username || "User"}
          </p>
          <p className="text-sm truncate text-muted-foreground">
            {user?.email || "user@example.com"}
          </p>
          <span className="text-xs px-2 py-1 rounded-md inline-block bg-primary text-primary-foreground">
            {user?.role || "Guest"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-3 overflow-y-auto">
        {/* App Section */}
        <div className="w-full border-b border-sidebar-ring ">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-1 px-4 text-muted-foreground">
            App
          </h3>
          <div className="flex justify-start items-center flex-nowrap mb-2">

            <NewProjectBtn
              userId={data?.id}
              order={order}
              className=" md:mt-0  font-medium w-full  bg-transparent text-secondary border-none shadow-sm 
            hover:brightness-105 transition "
              newClassName="text-red "
              align={isOpen ? "start" : "center"}
              side={isOpen ? "right" : "left"}
              alignOffset={isOpen ? 20 : 0}
              sideOffset={isOpen ? -100 : 20}
            />
          </div>
        </div>
        {/* user projects */}
        <SidebarProjectsSection
          projects={
            projects.data
              ? projects.data.map((p) => ({
                  id: p.id!,
                  title: p.title!,
                  order: p.order!,
                  type: p.type!,
                  userId: p.userId!,
                  createdAt: p.createdAt!, // string
                }))
              : null
          }
          isLoading={!projects.data && !projects.error}
        />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t text-center text-sm border-sidebar-border text-muted-foreground">
        TaskFlow v1.0
      </div>
    </aside>
  );
}

// ========================
// Hamburger Toggle Button 
// ========================
function HamburgerToggle({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="md:hidden p-2  rounded-md focus:outline-none absolute top-2 left-8 bg-background text-foreground border border-border"
    >
      {isOpen ? (
        <FiX size={20} />
      ) : (
        <Sidebar
          size={16}
          className="text-secondary  cursor-pointer hover:text-primary/80"
        />
      )}
    </button>
  );
}

export default function DashboardLayout({
  user,
}: {
  children?: React.ReactNode;
  user?: User;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-full max-h-full overflow-hidden  relative ">
      {/* Sidebar */}
      <UserSidebar
        user={user}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="">
        <HamburgerToggle onClick={toggleSidebar} isOpen={sidebarOpen} />
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden "
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
