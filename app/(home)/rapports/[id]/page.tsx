import LatestBlogs from "@/components/app/latest-blogs"
import MostViewedBlogs from "@/components/app/most-viewed-blogs"
import BlogSection from "@/components/app/blog-section"
import BlogCardSkeleton from "@/components/skeleton/blog-card-skeleton"
import BlogSectionSkeleton from "@/components/skeleton/blog-section-skeleton"
import { navigationsIconsItems } from "@/constants"
import Link from "next/link"
import { Suspense } from "react"
const RapportPage = async ({
  params,
}: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await params
  return (
    <section className="flex flex-col gap-8 px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:gap-12">
        <Suspense fallback={<BlogSectionSkeleton />}>
          <BlogSection id={id} type="RAPPORT" />
        </Suspense>
        <div className="flex flex-col space-y-6 md:w-2/5 lg:w-[30%] xl:w-[25%]">
          <h2 className="text-primary text-xl font-semibold md:text-2xl">
            الأكثر مشاهدة
          </h2>
          <Suspense fallback={<BlogCardSkeleton />}>
            <MostViewedBlogs size={3} path="rapports" type="RAPPORT" />
          </Suspense>
          <h2 className="text-primary text-xl font-semibold md:mt-8 md:text-2xl">
            آخر التقارير
          </h2>
          <Suspense fallback={<BlogCardSkeleton />}>
            <LatestBlogs size={3} path="rapports" type="RAPPORT" blogId={id} />
          </Suspense>
        </div>
      </div>
      <div className="mt-4 flex gap-2 self-center md:mt-8 md:gap-4">
        {navigationsIconsItems.map((item, index) => (
          <Link key={index} href={item.href} aria-label={item.label}>
            <div className="bg-primary hover:bg-secondary flex items-center justify-center rounded-full p-2 text-white transition-colors duration-200">
              <item.icon className="size-5 md:size-8" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RapportPage
