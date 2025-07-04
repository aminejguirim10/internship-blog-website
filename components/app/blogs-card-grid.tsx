"use client"
import BlogCard from "@/components/shared/blog-card"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import Pagination from "@/components/shared/pagination"
import { Icons } from "@/components/shared/icons"

type BlogsCardGridProps = {
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
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => {
            return <BlogCard key={blog.id} blog={blog as any} />
          })
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-600">
            <Icons.notbook className="size-8" />
            <div className="text-lg font-semibold">
              لم يتم العثور على أي مدونة
            </div>
          </div>
        )}
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
