import Image from "next/image"
import { Icons } from "@/components/shared/icons"
import { getBlog } from "@/data/get-blogs"
import { notFound } from "next/navigation"
import { Blog } from "@/types"
import { LoadMoreComments } from "@/components/app/load-more-comments"

const BlogSection = async ({ id }: { id: string }) => {
  const blog = (await getBlog(id)) as Blog | null
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
        className="blog-content-responsive"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .blog-content-responsive {
          max-width: none !important;
          width: 100% !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          hyphens: auto !important;
          line-height: 1.6 !important;
        }
        .blog-content-responsive * {
          max-width: none !important;
          width: 100% !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          box-sizing: border-box !important;
        }
        .blog-content-responsive p,
        .blog-content-responsive div,
        .blog-content-responsive h1,
        .blog-content-responsive h2,
        .blog-content-responsive h3,
        .blog-content-responsive h4,
        .blog-content-responsive h5,
        .blog-content-responsive h6,
        .blog-content-responsive span,
        .blog-content-responsive strong,
        .blog-content-responsive em,
        .blog-content-responsive ul,
        .blog-content-responsive ol,
        .blog-content-responsive li,
        .blog-content-responsive blockquote,
        .blog-content-responsive pre,
        .blog-content-responsive code {
          max-width: none !important;
          width: 100% !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          white-space: pre-wrap !important;
          box-sizing: border-box !important;
        }
        .blog-content-responsive img {
          max-width: 100% !important;
          width: auto !important;
          height: auto !important;
          display: block !important;
        }
        .blog-content-responsive table {
          width: 100% !important;
          max-width: none !important;
          table-layout: fixed !important;
          word-break: break-word !important;
        }
        .blog-content-responsive td,
        .blog-content-responsive th {
          word-break: break-word !important;
          overflow-wrap: break-word !important;
        }
        `,
        }}
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
      <LoadMoreComments blogId={id} pageSize={4} />
    </div>
  )
}

export default BlogSection
