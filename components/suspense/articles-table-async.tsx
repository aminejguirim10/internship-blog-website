import { BlogTable } from "../dashboard/blog-table"
import { getAllBlogsByType } from "@/data/get-blogs"
import type { BlogType } from "@prisma/client"

export async function BlogsTableAsync({ type }: { type: BlogType }) {
  const blogs = await getAllBlogsByType(type)
  return <BlogTable data={blogs} type={type} />
}
