import Image from "next/image"
import { Icons } from "@/components/shared/icons"
import Link from "next/link"
import { Event } from "@prisma/client"

//Todo Fixe the type of event
const EventSection = ({ event }: { event: any }) => {
  return (
    <div className="relative flex flex-col gap-4 md:w-3/5 lg:w-[70%] xl:w-[75%]">
      <div className="relative h-[250px] w-full md:h-[350px]">
        <Image
          src={event.image!}
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
        <div className="absolute bottom-5 left-1/2 z-10 w-full -translate-x-1/2 text-center text-lg leading-relaxed font-bold text-white lg:text-2xl">
          {event.title}
        </div>
      </div>
      <div className="text-primary flex gap-8 px-4 font-semibold">
        <div className="flex items-center justify-center gap-2">
          <Icons.calendar className="size-6" />
          {
            /*event.date.toLocaleDateString("ar-Oman", {
            year: "numeric",
          })*/
            event.date
          }
        </div>
        <div className="flex items-center justify-center gap-2">
          <Icons.clock className="size-6" />
          {event.hour}
        </div>
        <div className="flex items-center justify-center gap-2">
          <Icons.location className="size-6" />
          <Link
            href={event.link}
            className="hover:text-secondary transition-colors duration-200 hover:underline hover:underline-offset-8"
          >
            zoom meeting
          </Link>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-5">
        <p className="leading-relaxed md:text-lg">{event.description}</p>
        <div className="flex items-center justify-center gap-2 self-start">
          <span>يمكنك الانضمام عبر هذا</span>
          <span className="text-primary hover:text-secondary font-bold underline underline-offset-4 transition-colors duration-200">
            <Link href={event.link}>(رابط)</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default EventSection
