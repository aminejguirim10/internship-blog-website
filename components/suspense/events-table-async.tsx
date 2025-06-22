import { EventsTable } from "../dashboard/events-table"
import { getAllEvents } from "@/data/get-events"

export async function EventsTableAsync() {
  const events = await getAllEvents()
  return <EventsTable data={events} />
}
