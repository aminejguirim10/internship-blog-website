import { Skeleton } from "@/components/ui/skeleton"

const ArticlesLoadingPage = () => {
  return (
    <div className="flex flex-col-reverse px-2 py-8 lg:flex-row">
      <div className="flex-1 p-8">
        {/* Search Bar Skeleton */}
        <div className="mb-6 md:w-1/2">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="space-y-3">
              {/* Card Skeleton */}
              <Skeleton className="h-48 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="mt-8 flex items-center justify-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Sidebar Filters Skeleton */}
      <aside className="h-fit w-96 p-4 max-lg:mr-4 lg:w-[160px] lg:border-r lg:border-r-gray-200 xl:w-64">
        {/* Date Filter Section */}
        <div className="mb-6">
          <Skeleton className="mb-2 h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Separator */}
        <div className="mb-4 border border-gray-200" />

        {/* Author Filter Section */}
        <div>
          <Skeleton className="mb-2 h-5 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
    </div>
  )
}

export default ArticlesLoadingPage
