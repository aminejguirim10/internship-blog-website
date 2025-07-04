import { Skeleton } from "@/components/ui/skeleton"

const HomeLabelSkeleton = () => {
  return (
    <div className="py-8">
      <div className="flex justify-center">
        <div className="bg-primary rounded-t-2xl px-6 py-1">
          {/* Skeleton pour le texte du label */}
          <Skeleton className="h-5 w-24 bg-white/20" />
        </div>
      </div>
      {/* Ligne bleue en bas */}
      <div className="bg-primary h-[5px] w-full" />
    </div>
  )
}

export default HomeLabelSkeleton
