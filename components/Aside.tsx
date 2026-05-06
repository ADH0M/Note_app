"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
} | null;

export default function Sidebar({ user }: { user?: User }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Users", href: "/admin/users", icon: "👥" },
  ];

  const appItems = [
    { name: "Tasks mangement", href: "#", icon: "➕" },
    { name: "My Notes", href: "/notes", icon: "📝" },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-border text-foreground max-h-screen flex flex-col sticky top-0 h-screen">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-primary w-10 h-10 rounded-lg text-secondary flex items-center justify-center font-bold text-xl">
            T
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-primary">
            TaskFlow
          </span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-700">
        <div className="space-y-2">
          <p className="font-medium truncate">{user?.username || "User"}</p>
          <p className="text-sm text-gray-400 truncate">
            {user?.email || "user@example.com"}
          </p>
          <span className="text-xs bg-primary px-2 py-1 rounded text-secondary">
            {user?.role || "Guest"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
            Admin
          </h3>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
            App
          </h3>
          <ul className="space-y-2">
            {appItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Optional: Footer with logout/settings */}
      <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-500">
        TaskFlow v1.0
      </div>
    </aside>
  );
}
