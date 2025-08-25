import { AnimatedBeamSection } from "@/components/app/animated-beam-section"
import Write from "@/components/app/write"
import HomeLatestBlogs from "@/components/app/home-latest-blogs"
import ImageWithDescription from "@/components/shared/image-with-description"
import HomeBlogsSkeleton from "@/components/skeleton/home-blogs-skeleton"
import { ImageWithDescriptionItems } from "@/constants"
import { Suspense } from "react"
import HomeEventsSkeleton from "@/components/skeleton/home-events-skeleton"
import HomeEvents from "@/components/app/home-events"
import { OrbitingCirclesSection } from "@/components/app/orbiting-circles-section"
import HomeFaqs from "@/components/app/home-faqs"
import HomeLatestBlogsLabel from "@/components/app/home-latest-blogs-label"
import HomeLabelSkeleton from "@/components/skeleton/home-label-skeleton"
import NewsLetter from "@/components/app/news-letter"
import { ChatBot } from "@/components/app/chat-bot"

const imgdes1 = ImageWithDescriptionItems[2]
const imgdes2 = ImageWithDescriptionItems[1]
const imgdes3 = ImageWithDescriptionItems[3]
export default function HomePage() {
  return (
    <section className="py-4">
      <ImageWithDescription
        alt={imgdes1.alt}
        description={imgdes1.description}
        image={imgdes1.image}
        title={imgdes1.title}
      />
      <Suspense fallback={<HomeLabelSkeleton />}>
        <HomeLatestBlogsLabel rank={1} />
      </Suspense>
      <Suspense fallback={<HomeBlogsSkeleton />}>
        <HomeLatestBlogs rank={1} pageSize={6} />
      </Suspense>
      <div className="py-8" />
      <ImageWithDescription
        alt={imgdes2.alt}
        description={imgdes2.description}
        image={imgdes2.image}
        title={imgdes2.title}
        button={imgdes2.button}
        link={imgdes2.link}
      />

      <Suspense fallback={<HomeLabelSkeleton />}>
        <HomeLatestBlogsLabel rank={2} />
      </Suspense>
      <Suspense fallback={<HomeBlogsSkeleton />}>
        <HomeLatestBlogs rank={2} pageSize={6} />
      </Suspense>
      <Write />
      <Suspense fallback={<HomeLabelSkeleton />}>
        <HomeLatestBlogsLabel rank={3} />
      </Suspense>
      <Suspense fallback={<HomeBlogsSkeleton />}>
        <HomeLatestBlogs rank={3} pageSize={6} />
      </Suspense>
      <div className="py-8" />
      <ImageWithDescription
        alt={imgdes3.alt}
        description={imgdes3.description}
        image={imgdes3.image}
        title={imgdes3.title}
        button={imgdes3.button}
        link={imgdes3.link}
      />
      <div className="py-8">
        <div className="flex justify-center">
          <div className="bg-primary rounded-t-2xl px-6 py-1 font-semibold text-white">
            فعاليات المعهد
          </div>
        </div>
        <div className="bg-primary h-[5px] w-full" />
      </div>
      <Suspense fallback={<HomeEventsSkeleton />}>
        <HomeEvents size={4} />
      </Suspense>
      <div className="py-8" />
      <div className="flex flex-col items-center justify-center px-4 xl:flex-row">
        <div className="w-full xl:w-[40%]">
          <HomeFaqs />
        </div>
        <div className="w-full xl:w-[30%]">
          <AnimatedBeamSection />
        </div>
        <div className="w-full xl:w-[30%]">
          <OrbitingCirclesSection />
        </div>
      </div>
      <NewsLetter />
      <ChatBot />
    </section>
  )
}
