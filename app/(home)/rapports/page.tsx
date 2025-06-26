import SidebarFilters from "@/components/app/side-bar-filters"
import SearchBar from "@/components/app/search-bar"
import BlogsCardGrid from "@/components/app/blogs-card-grid"
import { filterBlogs } from "@/data/get-blogs"

export default async function RapportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const title = params.title || ""
  //@ts-ignore
  const date = params.date ? new Date(params.date) : null
  const author = params.author || ""
  const page = params.page ? parseInt(params.page, 10) : 1
  const pageSize = 9

  const { blogs, totalCount } = await filterBlogs(
    title,
    "RAPPORT",
    page,
    pageSize,
    date,
    author
  )

  return (
    <div className="flex flex-col-reverse px-2 py-8 lg:flex-row">
      <div className="flex-1 p-8">
        <SearchBar />
        <BlogsCardGrid
          blogs={blogs}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
        />
      </div>
      <SidebarFilters hasTypes={false} isBlog={true} />
    </div>
  )
}
