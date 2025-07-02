import {
  getDashboardMetrics,
  getEditorDashboardMetrics,
} from "@/data/get-dashboard"
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { checkEditor } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EditorDashboardMetrics } from "@/components/dashboard/editor-dashboard-metrics"

export async function DashboardMetricsAsync() {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }
  if (editor.role === "ADMIN") {
    const metrics = await getDashboardMetrics()
    return <DashboardMetrics metrics={metrics} />
  } else {
    const metricsEditor = await getEditorDashboardMetrics(editor.id)
    return (
      <EditorDashboardMetrics
        metrics={metricsEditor}
        authorName={editor.name || "المحرر"}
      />
    )
  }
}
