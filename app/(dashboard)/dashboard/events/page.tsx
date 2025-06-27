import { CreateEventDialog } from "@/components/dashboard/create-event-dialog"
import { EventsChartAsync } from "@/components/suspense/events-chart-async"
import { EventsMetricsAsync } from "@/components/suspense/events-metrics-async"
import { EventsTableAsync } from "@/components/suspense/events-table-async"
import { ChartSuspense } from "@/components/suspense/chart-suspense"
import { MetricsSuspense } from "@/components/suspense/metrics-suspense"
import { TableSuspense } from "@/components/suspense/table-suspense"

export default function EventsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 py-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex flex-col gap-2 px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  لوحة تحكم الأحداث
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  إدارة ومراجعة الأحداث والفعاليات المجدولة
                </p>
              </div>
              <CreateEventDialog />
            </div>
          </div>

          {/* Metrics Cards */}
          <MetricsSuspense>
            <EventsMetricsAsync />
          </MetricsSuspense>

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartSuspense>
              <EventsChartAsync />
            </ChartSuspense>
          </div>

          {/* Events Table */}
          <div className="space-y-4">
            <div className="px-4 lg:px-6">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                الأحداث الحديثة
              </h2>
            </div>
            <div className="px-6">
              <TableSuspense>
                <EventsTableAsync />
              </TableSuspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
