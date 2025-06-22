import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ChartSkeleton() {
  return (
    <Card className="@container/card" dir="rtl">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32 bg-slate-300" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-48 bg-slate-200" />
        </CardDescription>
        <div className="flex items-center gap-2">
          <div className="hidden gap-1 @[767px]/card:flex">
            <Skeleton className="h-8 w-20 rounded-md bg-slate-200" />
            <Skeleton className="h-8 w-20 rounded-md bg-slate-200" />
            <Skeleton className="h-8 w-20 rounded-md bg-slate-200" />
          </div>
          <Skeleton className="h-8 w-32 rounded-md bg-slate-200 @[767px]/card:hidden" />
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6" dir="ltr">
        <div className="relative aspect-auto h-[250px] w-full">
          {/* Chart area skeleton */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Grid lines simulation */}
            <div className="absolute inset-0 opacity-30">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-slate-200"
                  style={{ top: `${20 + i * 15}%` }}
                />
              ))}
            </div>

            {/* Chart line simulation */}
            <div className="absolute right-8 bottom-8 left-8 h-24">
              <div className="relative h-full">
                <svg className="h-full w-full" viewBox="0 0 300 100">
                  <defs>
                    <linearGradient
                      id="skeletonGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="rgb(148 163 184)"
                        stopOpacity="0.3"
                      />
                      <stop
                        offset="100%"
                        stopColor="rgb(148 163 184)"
                        stopOpacity="0.1"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 Q75,20 150,40 T300,30"
                    fill="url(#skeletonGradient)"
                    stroke="rgb(148 163 184)"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="absolute right-8 bottom-2 left-8 flex justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-8 bg-slate-200" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
