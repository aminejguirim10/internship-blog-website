import React from "react"

const RapportPage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params
  return <div>RapportPage {id}</div>
}

export default RapportPage
