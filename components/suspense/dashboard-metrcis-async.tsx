import { getDashboardMetrics } from "@/data/get-dashboard"
import { DashboardMetrics } from "../dashboard/dashboard-metrics"

export async function DashboardMetricsAsync() {
  const metrics = await getDashboardMetrics()
  return <DashboardMetrics metrics={metrics} />
}
