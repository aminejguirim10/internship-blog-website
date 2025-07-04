import { BlogsChartAsync } from "@/components/suspense/blogs-chart-async"
import { BlogsMetricsAsync } from "@/components/suspense/blogs-metrcis-async"
import { BlogsTableAsync } from "@/components/suspense/blogs-table-async"
import { ChartSuspense } from "@/components/suspense/chart-suspense"
import { MetricsSuspense } from "@/components/suspense/metrics-suspense"
import { TableSuspense } from "@/components/suspense/table-suspense"
import DashboardLabelsSkeleton from "@/components/skeleton/dashboard-labels-skeleton"
import DashboardLabels from "@/components/dashboard/dashboard-labels"
import { Suspense } from "react"
import { prisma } from "@/lib/db"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
    },
  })
  return {
    title: `مدونات - ${category?.name}`,
    description: `إحصائيات المدونات في فئة ${category?.name}`,
  }
}

const DashboardBlogPage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2 py-6">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <Suspense fallback={<DashboardLabelsSkeleton isMetrics={true} />}>
            <DashboardLabels categoryId={id} isMetrics={true} />
          </Suspense>

          {/* Metrics Cards */}
          <MetricsSuspense>
            <BlogsMetricsAsync type={id} />
          </MetricsSuspense>

          {/* Chart */}
          <div className="px-4 lg:px-6">
            <ChartSuspense>
              <BlogsChartAsync type={id} />
            </ChartSuspense>
          </div>

          {/* Reports Table */}
          <div className="space-y-4">
            <Suspense fallback={<DashboardLabelsSkeleton isMetrics={false} />}>
              <DashboardLabels categoryId={id} isMetrics={false} />
            </Suspense>
            <div className="px-6">
              <TableSuspense>
                <BlogsTableAsync type={id} />
              </TableSuspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardBlogPage
