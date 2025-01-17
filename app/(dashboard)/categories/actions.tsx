"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account"
import { useDeleteCategory } from "@/features/categores/api/use-delete-category"
import { useOpenCategory } from "@/features/categores/hooks/use-open-category"
import { useConfirm } from "@/hooks/use-confirm"
import { Edit, MoreVertical, Trash } from "lucide-react"

type Props = {
  id: string
}

export const Actions = ({ id }: Props) => {
  const { onOpen, onClose } = useOpenCategory()
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this category."
  )

  const deleteMutation = useDeleteCategory(id)

  const handleDelete = async () => {
    const ok = await confirm()
    if (ok) {
      deleteMutation.mutate()
    }
  }

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-8 p-0"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onOpen(id)}
            disabled={deleteMutation.isPending}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash className="size-4 mr-2 text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
