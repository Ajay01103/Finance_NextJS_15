import { z } from "zod"
import { Loader2 } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useOpenAccount } from "../hooks/use-open-account"
import { useGetAccount } from "../api/use-get-account"
import { AccountForm } from "./account-form"
import { useDeleteAccount } from "../api/use-delete-account"
import { useEditAccount } from "../api/use-edit-account"
import { useConfirm } from "@/hooks/use-confirm"
import { insertAccountSchema } from "@/db/schema"

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount()
  const [ConfirmDialog, confirm] = useConfirm(
    "Are u sure?",
    "You are about to delete this account."
  )

  const accountsQuery = useGetAccount(id)
  const deleteMutation = useDeleteAccount(id)
  const editMutation = useEditAccount(id)

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = accountsQuery.isLoading

  const formSchema = insertAccountSchema.pick({
    name: true,
  })

  type FormValues = z.input<typeof formSchema>

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const onDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => onClose(),
      })
    }
  }

  const defaultValues = accountsQuery.data
    ? {
        name: accountsQuery.data.name,
      }
    : { name: "" }

  return (
    <>
      <ConfirmDialog />
      <Sheet
        open={isOpen}
        onOpenChange={onClose}
      >
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>Edit an existing account.</SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValue={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
