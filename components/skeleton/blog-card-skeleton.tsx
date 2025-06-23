import { Skeleton } from "@/components/ui/skeleton"

export default function BlogCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 px-2 pt-1 pb-3 shadow-sm">
      {/* Image with overlay skeleton */}
      <div className="relative">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <div className="absolute bottom-0 left-0 flex h-8 w-32 items-center justify-center rounded-tr-2xl rounded-bl-lg">
          <Skeleton className="h-6 w-20 rounded" />
        </div>
      </div>

      {/* Title skeleton */}
      <div className="pr-2">
        <Skeleton className="h-5 w-4/5" />
      </div>

      {/* Content skeleton - 3 lines to match line-clamp-3 */}
      <div className="space-y-2 pr-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>

      {/* Meta information skeleton */}
      <div className="flex gap-2 pr-6">
        <div className="flex items-center gap-1">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="size-3 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}
