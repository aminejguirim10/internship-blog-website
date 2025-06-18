import React from "react"

const EventPage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params
  return <div>EventPage {id}</div>
}

export default EventPage
