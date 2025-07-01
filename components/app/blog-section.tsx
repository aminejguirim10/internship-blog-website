import Image from "next/image"
import { Icons } from "@/components/shared/icons"
import { getBlog } from "@/data/get-blogs"
import { notFound } from "next/navigation"
import { Blog } from "@/types"
import { BlogType } from "@prisma/client"
import { LoadMoreComments } from "./load-more-comments"

const BlogSection = async ({ id, type }: { id: string; type: BlogType }) => {
  const blog = (await getBlog(id, type)) as Blog | null
  if (!blog) {
    return notFound()
  }
  return (
    <div className="flex flex-col gap-6 md:w-3/5 lg:w-[70%] xl:w-[75%]">
      <div className="h-[250px] w-full md:h-[350px]">
        <Image
          src={blog.image}
          alt="image"
          width={2664}
          height={2000}
          className="h-full w-full rounded-lg object-cover shadow-lg"
        />
      </div>
      <div className="text-primary flex gap-6">
        <div className="flex items-center gap-2">
          <Icons.calendar className="size-6" />
          {new Date(blog.createdAt)
            .toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1")}
        </div>
        <div className="flex items-center gap-2">
          <Icons.pencil className="size-6" />
          {blog.author.name}
        </div>
        <div className="flex items-center gap-2">
          <Icons.eye className="size-6" />
          {blog.viewsCount}
        </div>
      </div>
      <h2 className="text-primary text-2xl font-bold md:text-3xl">
        {blog.title}
      </h2>
      <div
        className="prose prose-slate max-w-none text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <div className="flex gap-4">
        {blog.tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-primary rounded-lg px-4 py-2 text-sm font-semibold text-white"
          >
            {tag.name}
          </div>
        ))}
      </div>
      <div className="py-4" />
      <LoadMoreComments blogId={id} pageSize={3} />
    </div>
  )
}

export default BlogSection
