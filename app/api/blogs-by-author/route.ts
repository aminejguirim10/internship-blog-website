import { getBlogsByAuthor } from "@/data/get-blogs"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const authorId = searchParams.get("authorId")
  const page = parseInt(searchParams.get("page") || "1")
  const pageSize = parseInt(searchParams.get("pageSize") || "3")

  if (!authorId) {
    return NextResponse.json({ error: "Author ID requis" }, { status: 400 })
  }

  const { blogs } = await getBlogsByAuthor(authorId, page, pageSize)
  return NextResponse.json({ blogs })
}
