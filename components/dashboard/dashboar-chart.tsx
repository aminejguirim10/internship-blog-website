"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartConfig = {
  blogs: {
    label: "المحتوى",
    color: "hsl(221, 83%, 53%)", // Blue
  },
  events: {
    label: "الأحداث",
    color: "hsl(142, 76%, 36%)", // Green
  },
  applications: {
    label: "الطلبات",
    color: "hsl(25, 95%, 53%)", // Orange
  },
  users: {
    label: "المستخدمون",
    color: "hsl(271, 81%, 56%)", // Purple
  },
} satisfies ChartConfig

interface DashboardChartProps {
  data: Array<{
    date: string
    blogs: number
    events: number
    applications: number
    users: number
  }>
}

export function DashboardChart({ data }: DashboardChartProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date()
    let daysToSubtract = 30
    if (timeRange === "90d") {
      daysToSubtract = 90
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card" dir="rtl">
      <CardHeader>
        <CardTitle>نظرة عامة على النشاط</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            إحصائيات شاملة لجميع أقسام النظام عبر الوقت
          </span>
          <span className="@[540px]/card:hidden">نشاط النظام العام</span>
        </CardDescription>
        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">آخر 3 أشهر</ToggleGroupItem>
            <ToggleGroupItem value="30d">آخر 30 يوم</ToggleGroupItem>
            <ToggleGroupItem value="7d">آخر 7 أيام</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="اختر قيمة"
            >
              <SelectValue placeholder="آخر 30 يوم" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                آخر 3 أشهر
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                آخر 30 يوم
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                آخر 7 أيام
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6" dir="ltr">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBlogs" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-blogs)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-blogs)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillEvents" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-events)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-applications)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-applications)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-users)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="blogs"
              type="natural"
              fill="url(#fillBlogs)"
              stroke="var(--color-blogs)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="events"
              type="natural"
              fill="url(#fillEvents)"
              stroke="var(--color-events)"
              strokeWidth={2}
              stackId="b"
            />
            <Area
              dataKey="applications"
              type="natural"
              fill="url(#fillApplications)"
              stroke="var(--color-applications)"
              strokeWidth={2}
              stackId="c"
            />
            <Area
              dataKey="users"
              type="natural"
              fill="url(#fillUsers)"
              stroke="var(--color-users)"
              strokeWidth={2}
              stackId="d"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
