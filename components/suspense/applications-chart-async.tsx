import { ApplicationsChart } from "@/components/dashboard/applications-chart"
import { getApplicationsChartData } from "@/data/get-applications"

export async function ApplicationsChartAsync() {
  const chartData = await getApplicationsChartData()
  return <ApplicationsChart data={chartData} />
}
