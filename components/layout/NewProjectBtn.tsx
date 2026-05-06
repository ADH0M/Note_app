import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useDispatchHook } from "@/hooks/useSelector";
import { createProject } from "@/lib/actions/projects";
import { cn } from "@/lib/utils";
import { userProjects } from "@/store/reducers/project";
import { Plus } from "lucide-react";

type ProjectType =
  | "todo"
  | "project_tracker"
  | "meeting_notes"
  | "task_tracker";

const projectTypes: { type: ProjectType; label: string; shortcut: string }[] = [
  { type: "todo", label: "Todo", shortcut: "⌘T" },
  { type: "task_tracker", label: "Task Tracker", shortcut: "⌘K" },
  { type: "project_tracker", label: "Project Tracker", shortcut: "⌘P" },
  { type: "meeting_notes", label: "Meeting Notes", shortcut: "⌘M" },
];

const NewProjectBtn = ({
  className,
  newClassName,
  side = "bottom",
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  userId,
  order = 1000,
}: {
  className: string;
  newClassName?: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  userId: string | undefined;
  order: number;
}) => {
  const dispatch = useDispatchHook();

  const handleCreateProject = async (type: ProjectType) => {
    if (userId) {
      await createProject(type, userId, order);
      dispatch(userProjects(userId));
    }
  };

  return (
    <Menubar className={className}>
      <MenubarMenu>
        <MenubarTrigger className="w-full text-center">
          <Plus size={15} className="mx-1"/>
          New project
        </MenubarTrigger>
        <MenubarContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          className={cn(
            "border border-border w-56 md:w-72 mt-2 *:cursor-pointer",
            newClassName,
          )}
        >
          {projectTypes.map((item, index) => (
            <div key={item.type}>
              {index > 0 && <MenubarSeparator />}
              <MenubarItem
                className="p-1 md:p-3"
                onClick={() => handleCreateProject(item.type)}
              >
                {item.label}
                <MenubarShortcut>{item.shortcut}</MenubarShortcut>
              </MenubarItem>
            </div>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default NewProjectBtn;
