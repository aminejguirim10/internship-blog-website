import type React from "react"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/skeleton/table-skeleton"

interface TableSuspenseProps {
  children: React.ReactNode
}

export function TableSuspense({ children }: TableSuspenseProps) {
  return <Suspense fallback={<TableSkeleton />}>{children}</Suspense>
}
