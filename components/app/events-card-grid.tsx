"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import Pagination from "../shared/pagination"
import EventCard from "../shared/event-card"

type EventsBlogsCardGridProps = {
  page?: number
  pageSize?: number
  totalCount: number
  events: any[]
}

const EventsBlogsCardGrid = ({
  page = 1,
  pageSize = 9,
  totalCount,
  events,
}: EventsBlogsCardGridProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams)
      params.set("page", String(newPage))
      router.replace(`?${params.toString()}`)
    },
    [router, searchParams]
  )
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default EventsBlogsCardGrid
