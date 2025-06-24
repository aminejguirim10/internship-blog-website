import EventCardSkeleton from "./event-card-skeleton"

const HomeEventsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 px-20 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  )
}

export default HomeEventsSkeleton
