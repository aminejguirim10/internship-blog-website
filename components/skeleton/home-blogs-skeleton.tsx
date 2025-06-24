import BlogCardSkeleton from "./blog-card-skeleton"

const HomeBlogsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 px-20 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default HomeBlogsSkeleton
