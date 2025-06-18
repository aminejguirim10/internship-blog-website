import React from "react"

const ArticlePage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params
  return <div>ArticlePage {id}</div>
}

export default ArticlePage
