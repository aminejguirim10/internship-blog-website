import { getEvents } from "@/data/get-events"
import EventCard from "../shared/event-card"

const OtherEvents = async ({ size }: { size: number }) => {
  const events = await getEvents(size)
  return (
    <div className="flex flex-col gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

export default OtherEvents
