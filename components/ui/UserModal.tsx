"use client";
import { logoutAction } from "@/lib/actions/auth-action";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type User = {
  id: string | undefined;
  username: string | undefined;
  email: string | undefined;
  role: string | undefined;
} | null;

type IProps = {
  children: React.ReactNode;
  id?: string;
  user?: User;
};

export type IControler = {
  open: () => void;
};

const UserModal = forwardRef<IControler, IProps>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        close();
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <main className=" block" ref={modalRef}>
      <div>{props.children}</div>

      {isOpen && (
        <div className="bg-background/60 backdrop-blur-sm border border-border absolute w-screen h-screen top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center">
          <div className="bg-background border-border p-4 rounded-md border">
            <div className="bg-card border border-border p-6 rounded-xl shadow-lg min-w-[400px] flex flex-col gap-4 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="flex flex-col items-center gap-2 mb-2">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl font-bold text-accent-foreground">
                  {props.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg">{props.user?.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    {props.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {props.user?.role}
                </span>
              </div>

              <div className="border-t border-border pt-4 mt-2">
                <form action={logoutAction}>
                  <button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 py-2 rounded-md transition-colors font-medium">
                    Log Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
});

UserModal.displayName = "User-modal";

export default UserModal;
