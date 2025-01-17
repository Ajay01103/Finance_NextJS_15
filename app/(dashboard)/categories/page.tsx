"use client"

import { Loader2, Plus } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { columns } from "./columns"
import { Skeleton } from "@/components/ui/skeleton"
import { useNewCategory } from "@/features/categores/hooks/use-new-categories"
import { useGetCategories } from "@/features/categores/api/use-get-categories"
import { useBulkDeleteCategory } from "@/features/categores/api/use-bulk-delete-categories"

const CategoriesPage = () => {
  const { onOpen } = useNewCategory()
  const { data: categories, isLoading: categoriesLoading } = useGetCategories()
  const { mutate: deleteBulkCategories, isPending: categoryDeletingPending } =
    useBulkDeleteCategory()

  const isDisabled = categoriesLoading || categoryDeletingPending

  if (categoriesLoading) {
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
          <CardTitle className="text-xl line-clamp-1">Categories Page</CardTitle>
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
              deleteBulkCategories({ ids })
            }}
            filterKey="name"
            columns={columns}
            data={categories ?? []}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoriesPage
