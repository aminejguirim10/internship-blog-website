import { BlogsChartAsync } from "@/components/suspense/blogs-chart-async"
import { BlogsMetricsAsync } from "@/components/suspense/blogs-metrcis-async"
import { BlogsTableAsync } from "@/components/suspense/blogs-table-async"
import { ChartSuspense } from "@/components/suspense/chart-suspense"
import { MetricsSuspense } from "@/components/suspense/metrics-suspense"
import { TableSuspense } from "@/components/suspense/table-suspense"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة تحكم التقارير",
  description: "إدارة ومراجعة التقارير المنشورة",
}

export default function RapportsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 py-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex flex-col gap-2 px-4 lg:px-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              لوحة تحكم التقارير
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              إدارة ومراجعة التقارير المنشورة
            </p>
          </div>

          {/* Metrics Cards */}
          <MetricsSuspense>
            <BlogsMetricsAsync type="RAPPORT" />
          </MetricsSuspense>

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartSuspense>
              <BlogsChartAsync type="RAPPORT" />
            </ChartSuspense>
          </div>

          {/* Reports Table */}
          <div className="space-y-4">
            <div className="px-4 lg:px-6">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                التقارير الحديثة
              </h2>
            </div>
            <div className="px-6">
              <TableSuspense>
                <BlogsTableAsync type="RAPPORT" />
              </TableSuspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
