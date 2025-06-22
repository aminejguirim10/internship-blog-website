import { Card, CardHeader, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card
          key={index}
          className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 shadow-lg"
        >
          <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-slate-200/20 to-slate-300/20"></div>
          <CardHeader className="relative pb-3">
            <Skeleton className="h-3 w-20 bg-slate-200" />
            <Skeleton className="h-10 w-16 bg-slate-300" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full bg-slate-200" />
            </div>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="flex w-full flex-col gap-1">
              <Skeleton className="h-3 w-24 bg-slate-200" />
              <Skeleton className="h-3 w-20 bg-slate-100" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
