import React from "react"

const RecherchePage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params
  return <div>RecherchePage {id}</div>
}

export default RecherchePage
