"use client"

import { Loader2, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { transactions as transactionSchema } from "@/db/schema"
import { columns } from "./columns"
import { Skeleton } from "@/components/ui/skeleton"
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions"
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions"
import { useState } from "react"
import { UploadButton } from "./upload-button"
import { ImportCard } from "./import-card"
import { toast } from "sonner"
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account"
import { useBulkcreateTransactions } from "@/features/transactions/api/use-bulk-create-transaction"

const enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
}

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount()
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS)

  const { onOpen } = useNewTransaction()
  const { data: transactions, isLoading, isFetching } = useGetTransactions()
  const createTransactions = useBulkcreateTransactions()
  const deleteBulkTransaction = useBulkDeleteTransactions()

  const onCanelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS)
    setVariant(VARIANTS.LIST)
  }

  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results)
    setVariant(VARIANTS.IMPORT)
  }

  const onSubmitImport = async (values: (typeof transactionSchema.$inferInsert)[]) => {
    const accountId = await confirm()

    if (!accountId) return toast.error("Please select an account to continue")

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }))

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCanelImport()
      },
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-6 text-slate-300  animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCanelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Transaction History</CardTitle>
          <div className="flex items-center gap-x-2 ">
            <Button onClick={onOpen}>
              <Plus className="size-4" />
              Add new
            </Button>

            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>

        <CardContent>
          <DataTable
            disabled={isLoading || isFetching}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              deleteBulkTransaction.mutate({ ids })
            }}
            filterKey="payee"
            columns={columns}
            data={transactions ?? []}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionsPage
