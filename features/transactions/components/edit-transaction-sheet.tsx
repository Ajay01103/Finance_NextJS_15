import { z } from "zod"
import { Loader2 } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useConfirm } from "@/hooks/use-confirm"
import { insertTransactionSchema } from "@/db/schema"
import { useOpenTransaction } from "../hooks/use-open-transaction"
import { useDeleteTransaction } from "../api/use-delete-transaction"
import { useGetTransaction } from "../api/use-get-transaction"
import { useEditTransaction } from "../api/use-edit-transaction"
import { useGetCategories } from "@/features/categores/api/use-get-categories"
import { useCreateCategory } from "@/features/categores/api/use-create-category"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"
import { TransactionForm } from "./transaction-form"

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction()
  const [ConfirmDialog, confirm] = useConfirm(
    "Are u sure?",
    "You are about to delete this transaction"
  )

  const transactionQuery = useGetTransaction(id)
  const deleteMutation = useDeleteTransaction(id)
  const editMutation = useEditTransaction(id)

  // category queries
  const categoryQuery = useGetCategories()
  const categoryMutation = useCreateCategory()

  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    })

  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }))

  // accounts queries
  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    })

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }))

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending

  const formSchema = insertTransactionSchema.omit({
    id: true,
  })

  const isLoading =
    transactionQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading

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

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      }

  return (
    <>
      <ConfirmDialog />
      <Sheet
        open={isOpen}
        onOpenChange={onClose}
      >
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction.</SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValue={defaultValues}
              onDelete={onDelete}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
