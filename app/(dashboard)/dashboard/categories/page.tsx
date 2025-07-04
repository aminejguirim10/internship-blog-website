import { CreateCategoryDialog } from "@/components/dashboard/create-category-dialog"
import { CategoriesChartAsync } from "@/components/suspense/categories-chart-async"
import { CategoriesMetricsAsync } from "@/components/suspense/categories-metrics-async"
import { CategoriesTableAsync } from "@/components/suspense/categories-table-async"
import { ChartSuspense } from "@/components/suspense/chart-suspense"
import { MetricsSuspense } from "@/components/suspense/metrics-suspense"
import { TableSuspense } from "@/components/suspense/table-suspense"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "لوحة تحكم الفئات",
  description: "إدارة ومراجعة فئات المقالات والمحتوى",
}

export default function CategoriesPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 py-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex flex-col gap-2 px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  لوحة تحكم الفئات
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  إدارة ومراجعة فئات المحتوى
                </p>
              </div>
              <CreateCategoryDialog />
            </div>
          </div>

          {/* Metrics Cards */}
          <MetricsSuspense>
            <CategoriesMetricsAsync />
          </MetricsSuspense>

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartSuspense>
              <CategoriesChartAsync />
            </ChartSuspense>
          </div>

          {/* Categories Table */}
          <div className="space-y-4">
            <div className="px-4 lg:px-6">
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                الفئات الحديثة
              </h2>
            </div>
            <div className="px-6">
              <TableSuspense>
                <CategoriesTableAsync />
              </TableSuspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
