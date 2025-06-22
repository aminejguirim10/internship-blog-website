import type React from "react"
import { Suspense } from "react"
import { MetricsSkeleton } from "@/components/skeleton/metrics-skeleton"

interface MetricsSuspenseProps {
  children: React.ReactNode
}

export function MetricsSuspense({ children }: MetricsSuspenseProps) {
  return <Suspense fallback={<MetricsSkeleton />}>{children}</Suspense>
}
