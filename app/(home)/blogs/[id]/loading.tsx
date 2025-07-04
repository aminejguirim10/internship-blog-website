import React from "react"
import BlogCardSkeleton from "@/components/skeleton/blog-card-skeleton"
import BlogSectionSkeleton from "@/components/skeleton/blog-section-skeleton"

const BlogPageSkeleton = () => {
  return (
    <section className="flex flex-col gap-8 px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:gap-12">
        {/* Main Blog Section using the same skeleton as Suspense */}
        <BlogSectionSkeleton />

        {/* Sidebar with the same structure as the real page */}
        <div className="flex flex-col space-y-6 md:w-2/5 lg:w-[30%] xl:w-[25%]">
          {/* Most Viewed Section Title Skeleton */}
          <div className="bg-primary/40 h-7 w-32 animate-pulse rounded md:h-8"></div>

          {/* Most Viewed Blogs using the same skeleton as Suspense */}
          <BlogCardSkeleton />

          {/* Latest Category Section Title Skeleton */}
          <div className="bg-primary/40 h-7 w-28 animate-pulse rounded md:mt-8 md:h-8"></div>

          {/* Latest Blogs using the same skeleton as Suspense */}
          <BlogCardSkeleton />
        </div>
      </div>
    </section>
  )
}

export default BlogPageSkeleton
