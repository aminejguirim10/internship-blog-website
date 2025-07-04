import { getMostViewedBlogs } from "@/data/get-blogs"
import BlogCard from "@/components/shared/blog-card"
import { Icons } from "@/components/shared/icons"

const MostViewedBlogs = async ({
  size,
  categoryId,
}: {
  size: number
  categoryId: string
}) => {
  const mostViewedArticles = await getMostViewedBlogs(size, categoryId)

  return (
    <div className="flex flex-col gap-6">
      {mostViewedArticles && mostViewedArticles.length > 0 ? (
        mostViewedArticles.map((blog) => (
          <BlogCard key={blog.id} blog={blog as any} />
        ))
      ) : (
        <div className="border-primary flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-center font-semibold text-gray-500">
          <Icons.notbook className="mb-2 size-6" />
          <span> لا توجد المدوّنات الأكثر مشاهدة حاليا.</span>
        </div>
      )}
    </div>
  )
}

export default MostViewedBlogs
