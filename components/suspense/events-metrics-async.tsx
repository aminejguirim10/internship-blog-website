import { EventsMetrics } from "../dashboard/events-metrics"
import { getEventsMetrics } from "@/data/get-events"

export async function EventsMetricsAsync() {
  const metrics = await getEventsMetrics()
  return <EventsMetrics metrics={metrics} />
}
