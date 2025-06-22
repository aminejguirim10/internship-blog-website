import { ApplicationsMetrics } from "@/components/dashboard/applications-metrics"
import { getApplicationsMetrics } from "@/data/get-applications"

export async function ApplicationsMetricsAsync() {
  const metrics = await getApplicationsMetrics()
  return <ApplicationsMetrics metrics={metrics} />
}
