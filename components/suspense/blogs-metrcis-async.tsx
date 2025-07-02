import { BlogMetrics } from "@/components/dashboard/blog-metrics"
import { getBlogMetrics, getEditorBlogMetrics } from "@/data/get-blogs"
import { checkEditor } from "@/lib/auth"
import type { BlogType } from "@prisma/client"
import { redirect } from "next/navigation"
import { EditorBlogMetrics } from "@/components/dashboard/editor-blogs-metrics"

export async function BlogsMetricsAsync({ type }: { type: BlogType }) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }
  if (editor.role === "ADMIN") {
    const metricsAdmin = await getBlogMetrics(type)
    return <BlogMetrics metrics={metricsAdmin} type={type} />
  } else {
    const metricsEditor = await getEditorBlogMetrics(type, editor.id)
    return <EditorBlogMetrics metrics={metricsEditor} type={type} />
  }
}
