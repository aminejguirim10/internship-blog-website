import { getLatestBlogs } from "@/data/get-blogs"
import BlogCard from "@/components/shared/blog-card"
import { Icons } from "@/components/shared/icons"

const LatestBlogs = async ({
  size,
  categoryId,
  blogId,
}: {
  size: number
  categoryId: string
  blogId?: string
}) => {
  const latestBlogs = await getLatestBlogs(size, categoryId, blogId)

  return (
    <div className="flex flex-col gap-6">
      {latestBlogs && latestBlogs.length > 0 ? (
        latestBlogs.map((blog) => <BlogCard key={blog.id} blog={blog as any} />)
      ) : (
        <div className="border-primary flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center font-semibold text-gray-500">
          <Icons.notbook className="mb-2 size-6" />
          <span>لا توجد المدوّنات الحديثة حاليا.</span>
        </div>
      )}
    </div>
  )
}

export default LatestBlogs
