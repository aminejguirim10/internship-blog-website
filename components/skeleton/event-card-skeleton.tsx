import { Skeleton } from "@/components/ui/skeleton"

export default function EventCardSkeleton() {
  return (
    <div className="rounded-2xl shadow-lg">
      <div className="relative h-[180px] w-full md:h-[250px]">
        {/* Image skeleton */}
        <Skeleton className="h-full w-full rounded-lg" />

        {/* Title skeleton - centered */}
        <div className="absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center">
          <Skeleton className="mx-auto h-6 w-3/4 lg:h-7" />
          <Skeleton className="mx-auto mt-2 h-6 w-1/2 lg:h-7" />
        </div>

        {/* Bottom meta information skeleton */}
        <div className="absolute bottom-4 z-20 flex w-full items-center justify-between px-3">
          {/* Date and time skeleton */}
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-20 max-md:w-16" />
          </div>

          {/* Location/link skeleton */}
          <div className="flex items-center justify-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-24 max-md:w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
