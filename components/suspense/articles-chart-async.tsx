import { BlogChart } from "@/components/dashboard/blog-chart"
import { getBlogChartData } from "@/data/get-blogs"
import type { BlogType } from "@prisma/client"

export async function BlogsChartAsync({ type }: { type: BlogType }) {
  const blogs = await getBlogChartData(type)
  return <BlogChart data={blogs} type={type} />
}
