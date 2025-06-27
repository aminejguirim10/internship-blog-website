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
  applications: {
    label: "طلبات جديدة",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface ApplicationsChartProps {
  data: Array<{
    date: string
    applications: number
  }>
}

// Fonction utilitaire pour remplir les dates manquantes
function fillMissingDates(
  data: ApplicationsChartProps["data"],
  startDate: Date,
  endDate: Date
): ApplicationsChartProps["data"] {
  const filledData: ApplicationsChartProps["data"] = []
  const dataMap = new Map(data.map((item) => [item.date, item]))

  const current = new Date(startDate)
  while (current <= endDate) {
    const dateStr = current.toISOString().split("T")[0]
    filledData.push(dataMap.get(dateStr) ?? { date: dateStr, applications: 0 })
    current.setDate(current.getDate() + 1)
  }

  return filledData
}

export function ApplicationsChart({ data }: ApplicationsChartProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("30d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const referenceDate = new Date()
  let daysToSubtract = 30
  if (timeRange === "90d") {
    daysToSubtract = 90
  } else if (timeRange === "7d") {
    daysToSubtract = 7
  }

  const startDate = new Date(referenceDate)
  startDate.setDate(referenceDate.getDate() - daysToSubtract)

  const filteredRawData = data.filter((item) => {
    const date = new Date(item.date)
    return date >= startDate
  })

  const filteredData = fillMissingDates(
    filteredRawData,
    startDate,
    referenceDate
  )

  return (
    <Card className="@container/card" dir="rtl">
      <CardHeader>
        <CardTitle>نظرة عامة على الطلبات</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            الطلبات الجديدة المستلمة عبر الوقت
          </span>
          <span className="@[540px]/card:hidden">الجدول الزمني للطلبات</span>
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
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-applications)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-applications)"
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
              dataKey="applications"
              type="monotone"
              fill="url(#fillApplications)"
              stroke="var(--color-applications)"
              stackId="a"
              connectNulls={true}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
