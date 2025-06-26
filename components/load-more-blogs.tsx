"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { Blog } from "@/types"
import BlogCard from "./shared/blog-card"
import { Icons } from "./shared/icons"
import Link from "next/link"

interface LoadMoreBlogsProps {
  authorId: string
  pageSize?: number
}

export function LoadMoreBlogs({ authorId, pageSize = 6 }: LoadMoreBlogsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [hasBlogs, setHasBlogs] = useState(true)
  const { ref, inView } = useInView()

  const loadMore = async () => {
    const res = await fetch(
      `/api/blogs-by-author?authorId=${authorId}&page=${page}&pageSize=${pageSize}`
    )

    const data = await res.json()

    if (!data || data.blogs.length === 0) {
      setHasMore(false)
      if (blogs.length === 0) {
        setHasBlogs(false)
      }
      return
    }

    setBlogs((prev) => [...prev, ...data.blogs])
    setPage((prev) => prev + 1)
  }

  useEffect(() => {
    if (inView && hasMore) {
      loadMore()
    }
  }, [inView])
  if (!hasBlogs) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-xl font-semibold text-gray-700">
          لم يتم العثور على أي مدونة
        </h3>
        <p className="mt-2 text-gray-500">لم تقم بنشر أي مدونة بعد.</p>
        <Link
          href="/write-with-us"
          className="bg-primary hover:bg-primary/90 mt-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          أنشئ أول مدونة لك
        </Link>
      </div>
    )
  }
  return (
    <>
      {blogs.map((blog) => {
        let path: "articles" | "rapports" | "recherches" = "articles"
        if (blog.type === "ARTICLE") path = "articles"
        else if (blog.type === "RAPPORT") path = "rapports"
        else if (blog.type === "RECHERCHE") path = "recherches"
        return <BlogCard key={blog.id} blog={blog} path={path} />
      })}

      {hasMore && (
        <div className="col-span-full flex justify-center py-4" ref={ref}>
          <Icons.loader2 className="text-primary size-10 animate-spin" />
        </div>
      )}
    </>
  )
}
