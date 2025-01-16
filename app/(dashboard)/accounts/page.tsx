"use client"

import { Loader2, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { Skeleton } from "@/components/ui/skeleton"
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts"

const AccountsPage = () => {
  const { onOpen } = useNewAccount()
  const { data: accounts, isLoading: accountsLoading } = useGetAccounts()
  const { mutate: deleteBulkAccounts, isPending: accountsDeletePending } =
    useBulkDeleteAccounts()

  const isDisabled = accountsLoading || accountsDeletePending

  if (accountsLoading) {
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

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts Page</CardTitle>
          <Button onClick={onOpen}>
            <Plus className="size-4" />
            Add new
          </Button>
        </CardHeader>

        <CardContent>
          <DataTable
            disabled={isDisabled}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id)
              deleteBulkAccounts({ ids })
            }}
            filterKey="name"
            columns={columns}
            data={accounts ?? []}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default AccountsPage
