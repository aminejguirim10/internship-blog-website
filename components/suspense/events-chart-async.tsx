import { EventsChart } from "@/components/dashboard/events-chart"
import { getEventsChartData } from "@/data/get-events"

export async function EventsChartAsync() {
  const events = await getEventsChartData()
  return <EventsChart data={events} />
}
