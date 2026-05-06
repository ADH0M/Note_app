import { PencilIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FiMoreVertical } from "react-icons/fi";

export function CardActions({onEdit,onDelete}:{onEdit:()=>void , onDelete:()=>void}) {
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><FiMoreVertical /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-primary">
        <DropdownMenuGroup onClick={onEdit}>
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup onClick={onDelete}>
          <DropdownMenuItem variant="destructive">
            <TrashIcon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
