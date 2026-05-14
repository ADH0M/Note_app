/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Actions = {
  label: string;
  name: string;
  Icon: LucideIcon;
  handler: (...args: any[]) => void;
  variant?: "default" | "destructive";
};

interface PropType {
  title: string;
  actions: Actions[];
  className?: string;
  TitleIcon?: LucideIcon;
}

export function ReusableDropdownMenu({
  title,
  TitleIcon,
  actions,
  className,
}: PropType) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <Button variant="outline" className="p-0 border-0">
          {TitleIcon && <TitleIcon className="mr-2 " size={14}/>}
          {title}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={cn(className)}>
        {actions.map((act) => {
          const Icon = act.Icon;

          return (
            <DropdownMenuGroup key={`${act.label}-${act.name}`}>
              <DropdownMenuItem
                onClick={() => act.handler(act.label)}
                className={
                  act.variant === "destructive"
                    ? "text-destructive focus:destructive"
                    : ""
                }
              >
                <Icon className="mr-2 h-4 w-4" />
                {act.name}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
