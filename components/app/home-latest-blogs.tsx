import { getLatestBlogs } from "@/data/get-blogs"
import BlogCard from "../shared/blog-card"
import { BlogType } from "@prisma/client"

const HomeLatestBlogs = async ({
  size,
  type,
  path,
}: {
  size: number
  type: BlogType
  path: "rapports" | "articles" | "recherches"
}) => {
  const latestBlogs = await getLatestBlogs(size, type)
  return (
    <div className="grid grid-cols-1 gap-6 px-20 md:grid-cols-2 lg:grid-cols-3">
      {latestBlogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog as any} path={path} />
      ))}
    </div>
  )
}

export default HomeLatestBlogs
