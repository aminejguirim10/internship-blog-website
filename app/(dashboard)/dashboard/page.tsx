import { ChartSuspense } from "@/components/suspense/chart-suspense"
import { DashboardChartAsync } from "@/components/suspense/dashboard-chart-async"
import { DashboardMetricsAsync } from "@/components/suspense/dashboard-metrcis-async"
import { MetricsSuspense } from "@/components/suspense/metrics-suspense"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "نظرة شاملة على جميع أنشطة النظام والإحصائيات.",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 py-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex flex-col gap-2 px-4 lg:px-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              لوحة التحكم الرئيسية
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              نظرة شاملة على جميع أنشطة النظام والإحصائيات
            </p>
          </div>

          {/* Metrics Cards with Suspense */}
          <MetricsSuspense>
            <DashboardMetricsAsync />
          </MetricsSuspense>

          {/* Chart with Suspense */}
          <div className="px-4 lg:px-6">
            <ChartSuspense>
              <DashboardChartAsync />
            </ChartSuspense>
          </div>
        </div>
      </div>
    </div>
  )
}
