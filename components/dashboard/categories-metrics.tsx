"use client"

import {
  TrendingDown,
  TrendingUp,
  FolderOpen,
  Folder,
  BarChart3,
  Target,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CategoryMetrics {
  totalCategories: number
  newCategoriesThisMonth: number
  categoriesWithBlogs: number
  categoriesWithoutBlogs: number
  monthlyGrowth: number
  usagePercentage: number
  averageBlogsPerCategory: number
}

interface CategoryMetricsProps {
  metrics: CategoryMetrics
}

export function CategoriesMetrics({ metrics }: CategoryMetricsProps) {
  const growthIsPositive = metrics.monthlyGrowth >= 0
  const usageIsGood = metrics.usagePercentage >= 70

  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-blue-600/70 uppercase">
            إجمالي التصنيفات
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.totalCategories.toLocaleString()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-600/80">
              التصنيفات
            </span>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <Badge
            variant="secondary"
            className="border-blue-200 bg-blue-100 px-2 py-1 text-xs text-blue-700"
          >
            العدد الكلي
          </Badge>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-emerald-600/70 uppercase">
            جديد هذا الشهر
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.newCategoriesThisMonth.toLocaleString()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600/80">
              هذا الشهر
            </span>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex items-center gap-2">
            {growthIsPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span
              className={`text-xs font-medium ${
                growthIsPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {Math.abs(metrics.monthlyGrowth).toFixed(1)}% عن الشهر الماضي
            </span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-amber-600/70 uppercase">
            التصنيفات النشطة
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.categoriesWithBlogs.toLocaleString()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-600/80">
              مع مدونات
            </span>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <Badge
            variant="secondary"
            className={`px-2 py-1 text-xs ${
              usageIsGood
                ? "border-green-200 bg-green-100 text-green-700"
                : "border-yellow-200 bg-yellow-100 text-yellow-700"
            }`}
          >
            {metrics.usagePercentage.toFixed(1)}% معدل الاستخدام
          </Badge>
        </CardFooter>
      </Card>

      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-purple-600/70 uppercase">
            متوسط المدونات/تصنيف
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.averageBlogsPerCategory.toFixed(1)}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium text-purple-600/80">
              مدونات/تصنيف
            </span>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <Badge
            variant="secondary"
            className="border-purple-200 bg-purple-100 px-2 py-1 text-xs text-purple-700"
          >
            كثافة المحتوى
          </Badge>
        </CardFooter>
      </Card>
    </div>
  )
}
