import { getEvents } from "@/data/get-events"
import React from "react"
import EventCard from "../shared/event-card"

const HomeEvents = async ({ size }: { size: number }) => {
  const events = await getEvents(size)
  return (
    <div className="grid grid-cols-1 gap-6 px-20 md:grid-cols-2">
      {events && events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} />)
      ) : (
        <div className="border-primary col-span-3 flex flex-col items-center justify-center rounded-lg border-4 border-dashed px-4 py-16 text-gray-600">
          <svg
            className="text-primary mb-4 size-8 md:size-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="22" strokeWidth="4" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M16 24h16M24 16v16"
            />
          </svg>
          <div className="mb-2 text-xl font-bold">
            لا توجد فعاليات متاحة حالياً
          </div>
          <div className="text-gray-500">
            سيتم إضافة فعاليات جديدة قريباً. يرجى العودة لاحقاً.
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeEvents
