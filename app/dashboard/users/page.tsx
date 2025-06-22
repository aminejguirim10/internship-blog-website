import { UsersChartAsync } from "@/components/suspense/users-chart-async"
import { UsersMetricsAsync } from "@/components/suspense/users-metrics-async"
import { UsersTableAsync } from "@/components/suspense/users-table-async"
import { ChartSuspense } from "@/components/suspense/chart-suspense"
import { MetricsSuspense } from "@/components/suspense/metrics-suspense"
import { TableSuspense } from "@/components/suspense/table-suspense"
export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 py-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex flex-col gap-2 px-4 lg:px-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              لوحة تحكم المستخدمين
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              إدارة ومراجعة المستخدمين المسجلين
            </p>
          </div>

          {/* Metrics Cards */}
          <MetricsSuspense>
            <UsersMetricsAsync />
          </MetricsSuspense>

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartSuspense>
              <UsersChartAsync />
            </ChartSuspense>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            <div className="px-4 lg:px-6">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                المستخدمون الحديثون
              </h2>
            </div>
            <div className="px-6">
              <TableSuspense>
                <UsersTableAsync />
              </TableSuspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
