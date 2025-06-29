import { Skeleton } from "@/components/ui/skeleton"

const ProfileLoadingPage = () => {
  return (
    <div className="w-full pb-20 md:w-1/2">
      <div className="mx-auto w-full space-y-8 px-8 py-8">
        {/* Name Field */}
        <div className="space-y-2">
          {/* Label */}
          <Skeleton className="text-primary h-6 w-16 rounded-md" />
          {/* Input */}
          <div className="relative">
            <Skeleton className="border-input bg-background h-10 w-full rounded-md border" />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          {/* Label */}
          <Skeleton className="text-primary h-6 w-32 rounded-md" />
          {/* Input (disabled style) */}
          <div className="relative">
            <Skeleton className="border-input bg-muted h-10 w-full rounded-md border opacity-60" />
          </div>
        </div>

        {/* Date of Birth Field */}
        <div className="space-y-2">
          {/* Label */}
          <Skeleton className="text-primary h-6 w-24 rounded-md" />
          {/* Input */}
          <div className="relative">
            <Skeleton className="border-input bg-background h-10 w-full rounded-md border" />
          </div>
        </div>

        {/* Phone Number Field */}
        <div className="space-y-2">
          {/* Label */}
          <Skeleton className="text-primary h-6 w-20 rounded-md" />
          {/* Input */}
          <div className="relative">
            <Skeleton className="border-input bg-background h-10 w-full rounded-md border" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full">
          <Skeleton className="bg-primary/20 flex h-10 w-full items-center justify-center rounded-md">
            <Skeleton className="h-4 w-20" />
          </Skeleton>
        </div>
      </div>
    </div>
  )
}

export default ProfileLoadingPage
