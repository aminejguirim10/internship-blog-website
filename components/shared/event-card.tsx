import Image from "next/image"
import Link from "next/link"
import { Icons } from "@/components/shared/icons"
import { Event } from "@prisma/client"

//Todo Fixe the type of event
const EventCard = ({ event }: { event: any }) => {
  return (
    <div className="rounded-full shadow-2xl">
      <div className="relative h-[180px] w-full md:h-[250px]">
        <Image
          src={event.image || ""} //Todo default image
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
        <Link href={event.link}>
          <div className="absolute top-1/2 left-1/2 z-10 w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center text-lg leading-relaxed font-bold text-white lg:text-xl">
            {event.title}
          </div>
        </Link>
        <div className="absolute bottom-4 z-20 flex w-full items-center justify-between px-3 text-white">
          <div className="flex items-center justify-center gap-2">
            <Icons.calendar className="size-6" />
            <span className="max-md:text-sm">
              {event.date} - {event.hour}
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Icons.location className="size-6" />
            <Link
              href={event.link}
              className="hover:text-secondary text-lg transition-colors duration-200 hover:underline hover:underline-offset-8 max-md:text-sm"
            >
              zoom meeting
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventCard
