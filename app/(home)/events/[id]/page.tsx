import EventSection from "@/components/app/event-section"
import EventCard from "@/components/shared/event-card"

import { event, navigationsIconsItems } from "@/constants"
import Link from "next/link"

const EventPage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params

  //Todo:: Fetch the event by id from the database
  //suspense is used to handle the loading state while fetching data
  // fetch 3 events from the database
  // suspense the component until the data is fetched

  return (
    <section className="flex flex-col gap-8 px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:gap-12">
        <EventSection event={event} />
        <div className="flex flex-col space-y-6 md:w-2/5 lg:w-[30%] xl:w-[25%]">
          <h2 className="text-primary text-xl font-semibold md:text-2xl">
            فعاليات أخرى
          </h2>
          <EventCard event={event} />
          <EventCard event={event} />
          <EventCard event={event} />
        </div>
      </div>
      <div className="mt-4 flex gap-2 self-center md:mt-8 md:gap-4">
        {navigationsIconsItems.map((item, index) => (
          <Link key={index} href={item.href} aria-label={item.label}>
            <div className="bg-primary hover:bg-secondary flex items-center justify-center rounded-full p-2 text-white transition-colors duration-200">
              <item.icon className="size-5 md:size-8" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default EventPage
