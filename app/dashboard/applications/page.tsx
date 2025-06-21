import { ApplicationsMetrics } from "@/components/v0/applications-metrics"
import { ApplicationsChart } from "@/components/v0/applications-chart"
import { ApplicationsTable } from "@/components/v0/applications-table"
import {
  getAllApplications,
  getApplicationsChartData,
  getApplicationsMetrics,
} from "@/data/get-applications"

export default async function ApplicationsPage() {
  const [applications, metrics, chartData] = await Promise.all([
    getAllApplications(),
    getApplicationsMetrics(),
    getApplicationsChartData(),
  ])

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
          <ApplicationsMetrics metrics={metrics} />

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ApplicationsChart data={chartData} />
          </div>

          {/* Applications Table */}
          <div className="space-y-4">
            <div className="px-4 lg:px-6">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                الطلبات الحديثة
              </h2>
            </div>
            <div className="px-6">
              <ApplicationsTable data={applications} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
