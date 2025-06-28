import { getLatestBlogs } from "@/data/get-blogs"
import BlogCard from "../shared/blog-card"
import { BlogType } from "@prisma/client"
import { Icons } from "../shared/icons"

const LatestBlogs = async ({
  size,
  type,
  path,
  blogId,
}: {
  size: number
  type: BlogType
  path: "rapports" | "articles" | "recherches"
  blogId?: string
}) => {
  const latestBlogs = await getLatestBlogs(size, type, blogId)
  const label =
    path === "articles"
      ? "المقالات"
      : path === "rapports"
        ? "التقارير"
        : "الأبحاث"
  return (
    <div className="flex flex-col gap-6">
      {latestBlogs && latestBlogs.length > 0 ? (
        latestBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog as any} path={path} />
        ))
      ) : (
        <div className="border-primary flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center font-semibold text-gray-500">
          <Icons.notbook className="mb-2 size-6" />
          <span>لا توجد {label} الحديثة حاليا.</span>
        </div>
      )}
    </div>
  )
}

export default LatestBlogs
