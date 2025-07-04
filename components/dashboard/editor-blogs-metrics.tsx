"use client"

import { CheckCircle, Clock, Eye, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface EditorBlogMetrics {
  totalBlogsThisMonth: number
  blogsAccepted: number
  blogsPending: number
  viewsThisMonth: number
  totalBlogs: number
  acceptanceRate: number
}

interface EditorBlogMetricsProps {
  metrics: EditorBlogMetrics
  type: string
}

const getTypeLabel = () => {
  return "المحتوى"
}

export function EditorBlogMetrics({ metrics, type }: EditorBlogMetricsProps) {
  const acceptanceRateGood = metrics.acceptanceRate >= 70
  const typeLabel = getTypeLabel()
  const hasGoodPerformance =
    metrics.totalBlogsThisMonth > 0 && metrics.acceptanceRate > 60

  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      {/* Total Blogs This Month */}
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-blue-600/70 uppercase">
            {typeLabel} هذا الشهر
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.totalBlogsThisMonth}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-blue-200 bg-blue-50 text-xs text-blue-700"
            >
              <Calendar className="h-3 w-3" />
              جديد
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              📝 محتوى حديث
            </div>
            <div className="text-muted-foreground">منشور في الشهر الحالي</div>
          </div>
        </CardFooter>
      </Card>

      {/* Accepted Blogs */}
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-green-600/70 uppercase">
            {typeLabel} مقبولة
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.blogsAccepted}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-green-200 bg-green-50 text-xs text-green-700"
            >
              <CheckCircle className="h-3 w-3" />
              منشورة
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              ✅ معتمد ومنشور
            </div>
            <div className="text-muted-foreground">
              معدل القبول: {metrics.acceptanceRate}%
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Pending Blogs */}
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-orange-500/10 to-yellow-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-orange-600/70 uppercase">
            في الانتظار
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.blogsPending}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-orange-200 bg-orange-50 text-xs text-orange-700"
            >
              <Clock className="h-3 w-3" />
              مراجعة
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              ⏳ بانتظار الموافقة
            </div>
            <div className="text-muted-foreground">يحتاج مراجعة إدارية</div>
          </div>
        </CardFooter>
      </Card>

      {/* Views This Month */}
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-purple-600/70 uppercase">
            مشاهدات الشهر
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.viewsThisMonth.toLocaleString()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs ${hasGoodPerformance ? "border-green-200 bg-green-50 text-green-700" : "border-blue-200 bg-blue-50 text-blue-700"}`}
            >
              <Eye className="h-3 w-3" />
              {hasGoodPerformance ? "أداء ممتاز" : "جيد"}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              👁️ تفاعل القراء
            </div>
            <div className="text-muted-foreground">
              إجمالي {metrics.totalBlogs} {typeLabel}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
