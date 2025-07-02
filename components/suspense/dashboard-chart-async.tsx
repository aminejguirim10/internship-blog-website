import {
  getDashboardChartData,
  getEditorDashboardChartData,
} from "@/data/get-dashboard"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import { checkEditor } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EditorDashboardChart } from "@/components/dashboard/editor-dashboard-chart"

export async function DashboardChartAsync() {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }
  if (editor.role === "ADMIN") {
    const chartData = await getDashboardChartData()
    return <DashboardChart data={chartData} />
  } else {
    const chartDataEditor = await getEditorDashboardChartData(editor.id)
    return <EditorDashboardChart data={chartDataEditor} />
  }
}
