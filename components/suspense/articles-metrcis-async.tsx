import { BlogMetrics } from "../dashboard/blog-metrics"
import { getBlogMetrics } from "@/data/get-blogs"
import type { BlogType } from "@prisma/client"

export async function BlogsMetricsAsync({ type }: { type: BlogType }) {
  const metrics = await getBlogMetrics(type)
  return <BlogMetrics metrics={metrics} type={type} />
}
