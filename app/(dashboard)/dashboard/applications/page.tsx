import { ApplicationsChartAsync } from "@/components/suspense/applications-chart-async"
import { ChartSuspense } from "@/components/suspense/chart-suspense"
import { TableSuspense } from "@/components/suspense/table-suspense"
import { ApplicationsTableAsync } from "@/components/suspense/applications-table-async"
import { MetricsSuspense } from "@/components/suspense/metrics-suspense"
import { ApplicationsMetricsAsync } from "@/components/suspense/applications-metrics-async"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة تحكم الطلبات",
  description: "إدارة ومراجعة طلبات التوظيف من المتقدمين",
}

export default function ApplicationsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 py-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex flex-col gap-2 px-4 lg:px-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              لوحة تحكم الطلبات
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              إدارة ومراجعة طلبات التوظيف من المتقدمين
            </p>
          </div>

          {/* Metrics Cards */}
          <MetricsSuspense>
            <ApplicationsMetricsAsync />
          </MetricsSuspense>
          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartSuspense>
              <ApplicationsChartAsync />
            </ChartSuspense>
          </div>

          {/* Applications Table */}
          <div className="space-y-4">
            <div className="px-4 lg:px-6">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                الطلبات الحديثة
              </h2>
            </div>
            <div className="px-6">
              <TableSuspense>
                <ApplicationsTableAsync />
              </TableSuspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
