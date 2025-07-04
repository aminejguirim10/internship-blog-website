import { CategoriesMetrics } from "@/components/dashboard/categories-metrics"
import { getCategoriesMetrics } from "@/data/get-categories"

export async function CategoriesMetricsAsync() {
  const metrics = await getCategoriesMetrics()

  return <CategoriesMetrics metrics={metrics} />
}
