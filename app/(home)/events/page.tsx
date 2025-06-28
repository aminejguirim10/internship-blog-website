import EventsBlogsCardGrid from "@/components/app/events-card-grid"
import SearchBar from "@/components/app/search-bar"
import SidebarFilters from "@/components/app/side-bar-filters"
import { filterEvents } from "@/data/get-events"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "الأحداث",
  description: "استكشف الأحداث القادمة والفعاليات في مختلف المجالات.",
}

const EventsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const title = params.title || ""
  //@ts-ignore
  const date = params.date ? new Date(params.date) : null
  const page = params.page ? parseInt(params.page, 10) : 1
  const pageSize = 9

  const { events, totalCount } = await filterEvents(title, page, pageSize, date)

  return (
    <div className="flex flex-col-reverse px-2 py-8 lg:flex-row">
      <div className="flex-1 p-8">
        <SearchBar />
        <EventsBlogsCardGrid
          events={events}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
        />
      </div>
      <SidebarFilters hasTypes={false} isBlog={false} />
    </div>
  )
}

export default EventsPage
