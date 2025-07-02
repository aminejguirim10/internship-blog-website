import { BlogTable } from "@/components/dashboard/blog-table"
import { getAllBlogsByType, getEditorAllBlogsByType } from "@/data/get-blogs"
import { checkEditor } from "@/lib/auth"
import type { BlogType } from "@prisma/client"
import { redirect } from "next/navigation"
import { EditorBlogTable } from "@/components/dashboard/editor-blogs-table"

export async function BlogsTableAsync({ type }: { type: BlogType }) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }
  if (editor.role === "ADMIN") {
    const blogs = await getAllBlogsByType(type)
    return <BlogTable data={blogs} type={type} />
  } else {
    const blogsEditor = await getEditorAllBlogsByType(type, editor.id)
    return <EditorBlogTable data={blogsEditor} type={type} />
  }
}
