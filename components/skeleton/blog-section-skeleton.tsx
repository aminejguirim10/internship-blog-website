import { Skeleton } from "@/components/ui/skeleton"

export default function BlogSectionSkeleton() {
  return (
    <div className="flex flex-col gap-6 md:w-3/5 lg:w-[70%] xl:w-[75%]">
      {/* Image skeleton */}
      <div className="h-[250px] w-full md:h-[350px]">
        <Skeleton className="h-full w-full rounded-lg" />
      </div>

      {/* Meta information skeleton */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>

      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-4/5 md:h-9" />
        <Skeleton className="h-8 w-3/5 md:h-9" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/5" />
        </div>
      </div>

      {/* Tags skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-8 w-16 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-12 rounded-lg" />
        <Skeleton className="h-8 w-18 rounded-lg" />
      </div>
    </div>
  )
}
