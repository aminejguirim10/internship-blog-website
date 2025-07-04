import { CategoriesChart } from "@/components/dashboard/categories-chart"
import { getCategoriesChartData } from "@/data/get-categories"

export async function CategoriesChartAsync() {
  const data = await getCategoriesChartData()

  return <CategoriesChart data={data} />
}
