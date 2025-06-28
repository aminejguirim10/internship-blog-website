import EventSection from "@/components/app/event-section"
import OtherEvents from "@/components/app/other-events"
import EventCardSkeleton from "@/components/skeleton/event-card-skeleton"
import EventSectionSkeleton from "@/components/skeleton/event-section-skeleton"

import { navigationsIconsItems } from "@/constants"
import { prisma } from "@/lib/db"
import Link from "next/link"
import { Suspense } from "react"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
      description: true,
    },
  })
  return {
    title: `الفعالية ${event?.title}`,
    description: `${event?.description}`,
  }
}

const EventPage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params

  return (
    <section className="flex flex-col gap-8 px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:gap-12">
        <Suspense fallback={<EventSectionSkeleton />}>
          <EventSection id={id} />
        </Suspense>
        <div className="flex flex-col space-y-6 md:w-2/5 lg:w-[30%] xl:w-[25%]">
          <h2 className="text-primary text-xl font-semibold md:text-2xl">
            فعاليات أخرى
          </h2>
          <Suspense fallback={<EventCardSkeleton />}>
            <OtherEvents size={3} eventId={id} />
          </Suspense>
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
