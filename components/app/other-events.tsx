import { getEvents } from "@/data/get-events"
import EventCard from "../shared/event-card"
import { Icons } from "../shared/icons"

const OtherEvents = async ({
  size,
  eventId,
}: {
  size: number
  eventId?: string
}) => {
  const events = await getEvents(size, eventId)
  return (
    <div className="flex flex-col gap-6">
      {events && events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <div className="border-primary flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center font-semibold text-gray-500">
          <Icons.calendar className="mb-2 size-6" />
          <span>لا توجد فعاليات أخرى حاليا.</span>
        </div>
      )}
    </div>
  )
}

export default OtherEvents
