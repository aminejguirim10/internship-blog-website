"use client"
import BlogCard from "@/components/shared/blog-card"
import { BlogType } from "@prisma/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import Pagination from "../shared/pagination"

type BlogsCardGridProps = {
  type?: BlogType
  page?: number
  pageSize?: number
  totalCount: number
  blogs: any[]
}

export default function BlogsCardGrid({
  blogs,
  totalCount,
  page = 1,
  pageSize = 9,
}: BlogsCardGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams)
      params.set("page", String(newPage))
      router.replace(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => {
          let path: "articles" | "rapports" | "recherches" = "articles"
          if (blog.type === "ARTICLE") path = "articles"
          else if (blog.type === "RAPPORT") path = "rapports"
          else if (blog.type === "RECHERCHE") path = "recherches"
          return <BlogCard key={blog.id} blog={blog as any} path={path} />
        })}
      </div>
      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />
    </>
  )
}
