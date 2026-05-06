import UserSidebar from "@/components/ui/User-Sidebar";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
);

const layout = async ({ children }: { children: React.ReactNode }) => {
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

  return (
    <div className=" h-full bg-background text-secondary overflow-hidden">
      <main className="flex h-full w-full">
        <aside className="sticky left-0 bottom-0 top-0  z-50 max-h-full h-full">
          <UserSidebar user={user} />
        </aside>

        <section className="flex-1 overflow-y-auto min-h-screen z-40">
          {children}
        </section>
      </main>
    </div>
  );
};

export default layout;
