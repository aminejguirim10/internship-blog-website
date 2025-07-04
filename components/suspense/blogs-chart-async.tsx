import { BlogChart } from "@/components/dashboard/blog-chart"
import { getBlogChartData, getEditorBlogChartData } from "@/data/get-blogs"
import { checkEditor } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EditorBlogChart } from "@/components/dashboard/editor-blogs-chart"

export async function BlogsChartAsync({ type }: { type: string }) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }
  if (editor.role === "ADMIN") {
    const blogs = await getBlogChartData(type)
    return <BlogChart data={blogs} type={type} />
  } else {
    const blogsEditor = await getEditorBlogChartData(type, editor.id)
    return <EditorBlogChart data={blogsEditor} type={type} />
  }
}
