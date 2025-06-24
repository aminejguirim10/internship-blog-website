import { getEvents } from "@/data/get-events"
import React from "react"
import EventCard from "../shared/event-card"

const HomeEvents = async ({ size }: { size: number }) => {
  const events = await getEvents(size)
  return (
    <div className="grid grid-cols-1 gap-6 px-20 md:grid-cols-2">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

export default HomeEvents
