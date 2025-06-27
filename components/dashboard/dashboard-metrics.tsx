"use client"

import { FileText, Calendar, Users, Briefcase } from "lucide-react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface DashboardMetrics {
  blogsThisMonth: number
  eventsThisMonth: number
  applicationsThisMonth: number
  usersThisMonth: number
}

interface DashboardMetricsProps {
  metrics: DashboardMetrics
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
      {/* Blogs Card */}
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-blue-600/70 uppercase">
            المحتوى هذا الشهر
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.blogsThisMonth.toLocaleString()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              📝 مقالات وتقارير وبحوث
            </div>
            <div className="text-muted-foreground">محتوى جديد منشور</div>
          </div>
        </CardFooter>
      </Card>

      {/* Events Card */}
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-green-600/70 uppercase">
            الأحداث هذا الشهر
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.eventsThisMonth}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
              <Calendar className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              🗓️ فعاليات ومؤتمرات
            </div>
            <div className="text-muted-foreground">أحداث مجدولة جديدة</div>
          </div>
        </CardFooter>
      </Card>

      {/* Applications Card */}
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-orange-50 via-white to-yellow-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-orange-500/10 to-yellow-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-orange-600/70 uppercase">
            الطلبات هذا الشهر
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.applicationsThisMonth}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
              <Briefcase className="h-4 w-4 text-orange-600" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              💼 طلبات جديدة
            </div>
            <div className="text-muted-foreground">متقدمون جدد</div>
          </div>
        </CardFooter>
      </Card>

      {/* Users Card */}
      <Card className="@container/card relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <div className="absolute top-0 right-0 h-20 w-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10"></div>
        <CardHeader className="relative pb-3">
          <CardDescription className="text-xs font-medium tracking-wide text-purple-600/70 uppercase">
            المستخدمون هذا الشهر
          </CardDescription>
          <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent tabular-nums sm:text-4xl">
            {metrics.usersThisMonth}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1 font-medium text-gray-700">
              👥 مستخدمون جدد
            </div>
            <div className="text-muted-foreground">تسجيلات حديثة</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
