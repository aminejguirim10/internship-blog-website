"use client"

import { TrendingDown, TrendingUp, CheckCircle, Clock, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { BlogType } from "@prisma/client"

interface BlogMetrics {
  totalBlogs: number
  newBlogsThisMonth: number
  acceptedBlogs: number
  pendingBlogs: number
  rejectedBlogs: number
  totalViews: number
  monthlyGrowth: number
  acceptanceRate: number
}

interface BlogMetricsProps {
  metrics: BlogMetrics
  type: BlogType
}

const getTypeLabel = (type: BlogType) => {
  switch (type) {
    case "ARTICLE":
      return "المقالات"
    case "RAPPORT":
      return "التقارير"
    case "RECHERCHE":
      return "البحوث"
    default:
      return "المحتوى"
  }
}

export function BlogMetrics({ metrics, type }: BlogMetricsProps) {
  const growthIsPositive = metrics.monthlyGrowth >= 0
  const acceptanceRateGood = metrics.acceptanceRate >= 70
  const typeLabel = getTypeLabel(type)

  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-blue-600/70 uppercase">
            إجمالي {typeLabel}
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.totalBlogs.toLocaleString()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs ${growthIsPositive ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}
            >
              {growthIsPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {growthIsPositive ? "+" : ""}
              {metrics.monthlyGrowth}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              {growthIsPositive ? "📈 نمو هذا الشهر" : "📉 انخفاض هذا الشهر"}
            </div>
            <div className="text-muted-foreground">
              جميع {typeLabel} المنشورة
            </div>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-green-600/70 uppercase">
            {typeLabel} مقبولة
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.acceptedBlogs}
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
              ✅ محتوى معتمد
            </div>
            <div className="text-muted-foreground">متاح للقراءة</div>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-orange-500/10 to-yellow-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-orange-600/70 uppercase">
            في الانتظار
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.pendingBlogs}
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
            <div className="text-muted-foreground">يحتاج مراجعة</div>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-purple-600/70 uppercase">
            معدل القبول
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.acceptanceRate}%
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs ${acceptanceRateGood ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}
            >
              <Eye className="h-3 w-3" />
              {acceptanceRateGood ? "ممتاز" : "يحتاج تحسين"}
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              📊 جودة المحتوى
            </div>
            <div className="text-muted-foreground">
              {metrics.totalViews.toLocaleString()} مشاهدة إجمالية
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
