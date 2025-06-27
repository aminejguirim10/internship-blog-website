import { getDashboardChartData } from "@/data/get-dashboard"
import { DashboardChart } from "../dashboard/dashboar-chart"

export async function DashboardChartAsync() {
  const chartData = await getDashboardChartData()
  return <DashboardChart data={chartData} />
}
