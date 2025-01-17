import { z } from "zod"

import { insertCategorySchema } from "@/db/schema"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CategoryForm } from "./category-form"
import { useNewCategory } from "../hooks/use-new-categories"
import { useCreateCategory } from "../api/use-create-category"

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory()
  const { mutate, isPending } = useCreateCategory()

  const formSchema = insertCategorySchema.pick({
    name: true,
  })

  type FormValues = z.input<typeof formSchema>

  const onSubmit = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}
    >
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={isPending}
          defaultValue={{
            name: "",
          }}
        />
      </SheetContent>
    </Sheet>
  )
}
