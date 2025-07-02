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
    label: "إجمالي المقالات",
    color: "hsl(221, 83%, 53%)", // Blue
  },
  accepted: {
    label: "المقبولة",
    color: "hsl(142, 76%, 36%)", // Green
  },
  pending: {
    label: "في الانتظار",
    color: "hsl(25, 95%, 53%)", // Orange
  },
  comments: {
    label: "التعليقات",
    color: "hsl(346, 77%, 49%)", // Pink/Red
  },
  views: {
    label: "المشاهدات",
    color: "hsl(271, 81%, 56%)", // Purple
  },
} satisfies ChartConfig

interface EditorDashboardChartProps {
  data: Array<{
    date: string
    blogs: number
    accepted: number
    pending: number
    views: number
    comments: number
  }>
}

export function EditorDashboardChart({ data }: EditorDashboardChartProps) {
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
        <CardTitle>نظرة عامة على نشاطي</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            إحصائيات مفصلة لمودوناتي ومشاهداتها وتفاعل القراء عبر الوقت
          </span>
          <span className="@[540px]/card:hidden">نشاط مدوناتي</span>
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
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-blogs)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillAccepted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-accepted)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accepted)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pending)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillComments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-comments)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-comments)"
                  stopOpacity={0.05}
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
              type="monotone"
              fill="url(#fillBlogs)"
              stroke="var(--color-blogs)"
              strokeWidth={2}
              fillOpacity={0.4}
            />
            <Area
              dataKey="accepted"
              type="monotone"
              fill="url(#fillAccepted)"
              stroke="var(--color-accepted)"
              strokeWidth={2}
              fillOpacity={0.4}
            />
            <Area
              dataKey="pending"
              type="monotone"
              fill="url(#fillPending)"
              stroke="var(--color-pending)"
              strokeWidth={2}
              fillOpacity={0.4}
            />
            <Area
              dataKey="views"
              type="monotone"
              fill="url(#fillViews)"
              stroke="var(--color-views)"
              strokeWidth={2}
              fillOpacity={0.4}
            />
            <Area
              dataKey="comments"
              type="monotone"
              fill="url(#fillComments)"
              stroke="var(--color-comments)"
              strokeWidth={2}
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
