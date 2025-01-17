"use client"

import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
import { EditCategorySheet } from "@/features/categores/components/edit-category-sheet"
import { NewCategorySheet } from "@/features/categores/components/new-category-sheet"
import { useMountedState } from "react-use"

export const SheetProvider = () => {
  const isMounted = useMountedState()

  if (!isMounted) return null

  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />

      <NewCategorySheet />
      <EditCategorySheet />
    </>
  )
}
