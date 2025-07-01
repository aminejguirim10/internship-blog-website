import { getCommentsByBlog } from "@/data/get-comments"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const blogId = searchParams.get("blogId")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "10")

  if (!blogId) {
    return NextResponse.json({ error: "Blog ID requis" }, { status: 400 })
  }

  const result = await getCommentsByBlog(blogId, page, pageSize)

  return NextResponse.json(result)
}
