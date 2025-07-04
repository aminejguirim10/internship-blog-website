import { Skeleton } from "@/components/ui/skeleton"

interface DashboardLabelsSkeletonProps {
  isMetrics: boolean
}

const DashboardLabelsSkeleton = ({
  isMetrics,
}: DashboardLabelsSkeletonProps) => {
  if (isMetrics) {
    return (
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        {/* Title skeleton */}
        <Skeleton className="h-8 w-48 bg-slate-200 sm:h-9" />
        {/* Description skeleton */}
        <Skeleton className="h-4 w-64 bg-slate-100 sm:h-5 sm:w-80" />
      </div>
    )
  } else {
    return (
      <div className="px-4 lg:px-6">
        {/* Section title skeleton */}
        <Skeleton className="h-6 w-32 bg-slate-200 sm:h-7 sm:w-40" />
      </div>
    )
  }
}

export default DashboardLabelsSkeleton
