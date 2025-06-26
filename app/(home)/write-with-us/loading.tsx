import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const WriteWithUsLoadingPage = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-10 md:py-16"
      dir="rtl"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <Skeleton className="mx-auto mb-2 h-10 w-80" />
          <Skeleton className="mx-auto h-6 w-60" />
        </div>

        <div className="space-y-6">
          {/* Blog Information Card */}
          <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-5 w-60" />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>

              {/* Blog Type Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>

              {/* Tags Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-14" />
                </div>
              </div>

              {/* Image Upload Field */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="relative rounded-lg border-2 border-dashed border-slate-300 p-6">
                  <div className="space-y-4 text-center">
                    <Skeleton className="mx-auto h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="mx-auto h-4 w-48" />
                      <Skeleton className="mx-auto h-3 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Editor Card */}
          <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-72" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="space-y-4 rounded-md border border-slate-200 p-4">
                  {/* Editor Toolbar */}
                  <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-8" />
                    ))}
                  </div>
                  {/* Editor Content Area */}
                  <div className="min-h-[300px] space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="py-4">
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

export default WriteWithUsLoadingPage
