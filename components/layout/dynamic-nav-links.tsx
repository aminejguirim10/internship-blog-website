"use client"
import Link from "next/link"

interface Category {
  id: string
  name: string
}

interface DynamicNavLinksProps {
  className?: string
  categories: Category[]
  isLoading: boolean
}

export default function DynamicNavLinks({
  className,
  categories,
  isLoading,
}: DynamicNavLinksProps) {
  const isMobile = className?.includes("flex-col")

  if (isLoading) {
    return (
      <div className={isMobile ? "space-y-2 pr-4" : "flex items-center gap-4"}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div
              className={
                isMobile
                  ? "h-5 w-16 rounded bg-gray-300"
                  : "h-5 w-16 rounded bg-white/20"
              }
            ></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={isMobile ? "space-y-2" : "flex gap-4"}>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/blogs?categoryId=${category.id}`}
          className={
            isMobile
              ? "block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
              : "hover:text-secondary flex items-center justify-center px-4 font-semibold text-white transition-colors duration-200 hover:underline hover:underline-offset-8 max-lg:text-sm"
          }
        >
          {category.name}
        </Link>
      ))}
    </div>
  )
}
