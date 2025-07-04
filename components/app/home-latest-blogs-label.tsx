import { getHomeLatestCategories } from "@/data/get-categories"

const HomeLatestBlogsLabel = async ({ rank }: { rank: number }) => {
  const category = await getHomeLatestCategories(rank)
  const title = category ? `أخر ${category.name} ` : "أخر مـدونات"
  return (
    <div className="py-8">
      <div className="flex justify-center">
        <div className="bg-primary rounded-t-2xl px-6 py-1 font-semibold text-white">
          {title}
        </div>
      </div>
      <div className="bg-primary h-[5px] w-full" />
    </div>
  )
}

export default HomeLatestBlogsLabel
