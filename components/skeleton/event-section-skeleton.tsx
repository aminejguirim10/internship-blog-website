import { Skeleton } from "@/components/ui/skeleton"

export default function EventSectionSkeleton() {
  return (
    <div className="relative flex flex-col gap-4 md:w-3/5 lg:w-[70%] xl:w-[75%]">
      {/* Image with overlay and title skeleton */}
      <div className="relative h-[250px] w-full md:h-[350px]">
        <Skeleton className="h-full w-full rounded-lg" />
        {/* Simulate the gradient overlay area */}
        <div className="absolute bottom-5 left-1/2 z-10 w-full -translate-x-1/2 text-center">
          <Skeleton className="mx-auto h-6 w-3/4 lg:h-8" />
        </div>
      </div>

      {/* Event meta information skeleton */}
      <div className="flex gap-8 px-4">
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Description and link section skeleton */}
      <div className="mt-5 flex flex-col gap-5">
        {/* Description skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full md:h-5" />
          <Skeleton className="h-4 w-full md:h-5" />
          <Skeleton className="h-4 w-4/5 md:h-5" />
          <Skeleton className="h-4 w-full md:h-5" />
          <Skeleton className="h-4 w-3/4 md:h-5" />
        </div>

        {/* Join link skeleton */}
        <div className="flex items-center justify-center gap-2 self-start">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}
