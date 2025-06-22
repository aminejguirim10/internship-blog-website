import type React from "react"
import { Suspense } from "react"
import { ChartSkeleton } from "@/components/skeleton/chart-skeleton"

interface ChartSuspenseProps {
  children: React.ReactNode
}

export function ChartSuspense({ children }: ChartSuspenseProps) {
  return <Suspense fallback={<ChartSkeleton />}>{children}</Suspense>
}
