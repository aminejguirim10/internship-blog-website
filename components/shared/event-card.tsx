import Image from "next/image"
import Link from "next/link"
import { Icons } from "@/components/shared/icons"
import { Event } from "@prisma/client"

const EventCard = ({ event }: { event: Event }) => {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="rounded-full shadow-2xl">
        <div className="relative h-[180px] w-full md:h-[250px]">
          <Image
            src={event.image}
            alt="image"
            width={2664}
            height={2000}
            className="h-full w-full rounded-lg object-cover shadow-lg"
          />
          <Image
            src={"/assets/gradient.png"}
            alt="gradient"
            width={1332}
            height={316}
            className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full rounded-lg object-cover opacity-75"
          />

          <div className="absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center text-lg leading-relaxed font-bold text-white lg:text-xl">
            {event.title}
          </div>

          <div className="absolute bottom-4 z-20 flex w-full items-center justify-between px-3 text-white">
            <div className="flex items-center justify-center gap-2">
              <Icons.calendar className="size-6" />
              <span className="max-md:text-sm">
                {new Date(event.date)
                  .toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1")}{" "}
                - {event.hour}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Icons.location className="size-6" />
              <div className="text-lg max-md:text-sm">zoom meeting</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
