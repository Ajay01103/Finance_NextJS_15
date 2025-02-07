"use client"

import { useGetsummary } from "@/features/summary/api/use-get-summary"
import { useSearchParams } from "next/navigation"
import { DataCard, DataCardLoading } from "./data-card"
import { formatDateRange } from "@/lib/utils"
import { FaPiggyBank } from "react-icons/fa"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"

export const DataGrid = () => {
  const params = useSearchParams()
  const from = params.get("from") || undefined
  const to = params.get("to") || undefined

  const { data, isLoading } = useGetsummary()

  const dateRangeLabel = formatDateRange({ to, from })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8  pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={data?.remaingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expenseAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTrendDown}
        dateRange={dateRangeLabel}
      />
    </div>
  )
}
