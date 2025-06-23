import { getLatestBlogs } from "@/data/get-blogs"
import BlogCard from "../shared/blog-card"
import { BlogType } from "@prisma/client"

const LatestBlogs = async ({
  size,
  type,
  path,
}: {
  size: number
  type: BlogType
  path: "rapports" | "articles" | "recherches"
}) => {
  const latestBlogs = await getLatestBlogs(size, type)
  //Todo:more customize the flex box for another usability
  return (
    <div className="flex flex-col gap-6">
      {latestBlogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog as any} path={path} />
      ))}
    </div>
  )
}

export default LatestBlogs
