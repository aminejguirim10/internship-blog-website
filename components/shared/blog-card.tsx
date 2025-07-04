import Image from "next/image"
import React from "react"
import { Icons } from "@/components/shared/icons"
import Link from "next/link"
import { Blog } from "@/types"

const BlogCard = ({ blog }: { blog: Blog }) => {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <div className="flex flex-col gap-2 rounded-lg border border-gray-200 px-2 pt-1 pb-3 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="relative">
          <Image
            src={blog.image}
            alt="image"
            width={2664}
            height={2000}
            className="h-[200px] w-full rounded-lg object-cover shadow-lg"
          />
          <div className="bg-primary absolute bottom-0 left-0 flex h-8 w-32 items-center justify-center rounded-tr-2xl rounded-bl-lg text-lg text-white">
            منشورات
          </div>
        </div>
        <h2 className="text-primary truncate pr-2 font-bold">{blog.title}</h2>
        <div
          className="prose prose-slate line-clamp-3 max-w-none pr-2 text-sm leading-relaxed text-gray-500"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <div className="text-primary flex gap-2 pr-6 text-sm font-semibold">
          <div className="flex shrink-0 items-center gap-1">
            <Icons.calendar className="size-3" />
            {new Date(blog.createdAt)
              .toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3/$2/$1")}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <Icons.pencil className="size-3 shrink-0" />
            <span className="truncate">{blog.author.name}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BlogCard
