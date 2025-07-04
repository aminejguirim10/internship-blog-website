import { Icons } from "@/components/shared/icons"

const Loading = () => {
  return (
    <div className="container mx-auto min-h-1/2 max-w-7xl px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full flex justify-center py-4">
          <Icons.loader2 className="text-primary size-10 animate-spin" />
        </div>
      </div>
    </div>
  )
}

export default Loading
