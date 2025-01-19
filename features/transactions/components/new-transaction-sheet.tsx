import { z } from "zod"

import { insertTransactionSchema } from "@/db/schema"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useNewTransaction } from "../hooks/use-new-transaction"
import { useCreateTransaction } from "../api/use-create-transaction"
import { useCreateCategory } from "@/features/categores/api/use-create-category"
import { useGetCategories } from "@/features/categores/api/use-get-categories"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-account"
import { TransactionForm } from "./transaction-form"
import { Loader2 } from "lucide-react"

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction()
  const { mutate: createTransaction, isPending: transactionPending } =
    useCreateTransaction()

  const formSchema = insertTransactionSchema.omit({
    id: true,
  })

  // Category queries
  const { mutate: createCategory, isPending: categoryPending } = useCreateCategory()
  const { data: categories, isLoading: categoryLoading } = useGetCategories()

  const onCreateCategory = (name: string) => {
    createCategory({ name })
  }

  const categoryOptions = (categories ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }))

  // accounts queries
  const { data: accounts, isPending: accountsLoading } = useGetAccounts()
  const { mutate: createAccount, isPending: accountPending } = useCreateAccount()

  const onCreateAccount = (name: string) => {
    createAccount({ name })
  }

  const accountOptions = (accounts ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }))

  type FormValues = z.input<typeof formSchema>

  const onSubmit = (values: FormValues) => {
    createTransaction(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  const isPending = transactionPending || categoryPending || accountPending
  const isLoading = categoryLoading || accountsLoading

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}
    >
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add a new Transaction</SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            defaultValue={{
              date: new Date(),
              accountId: "",
              categoryId: null,
              amount: "",
              payee: "",
              notes: null,
            }}
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
            accountOptions={accountOptions}
            onCreateAccount={onCreateAccount}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}
