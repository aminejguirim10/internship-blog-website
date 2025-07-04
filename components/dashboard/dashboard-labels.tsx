import { getCategory } from "@/data/get-categories"
interface DashboardLabelsProps {
  categoryId: string
  isMetrics: boolean
}

const DashboardLabels = async ({
  categoryId,
  isMetrics,
}: DashboardLabelsProps) => {
  const category = await getCategory(categoryId)

  if (isMetrics) {
    return (
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          لوحة تحكم {category?.name!}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          إدارة ومراجعة {category?.name!} المنشورة
        </p>
      </div>
    )
  } else {
    return (
      <div className="px-4 lg:px-6">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {category?.name!} الحديثة
        </h2>
      </div>
    )
  }
}

export default DashboardLabels
