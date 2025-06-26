import { LoadMoreBlogs } from "@/components/load-more-blogs"
import { checkUser } from "@/lib/auth"
import { redirect } from "next/navigation"

const AuthorBlogs = async () => {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }
  return (
    <div className="container mx-auto min-h-1/2 max-w-7xl px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LoadMoreBlogs authorId={user.id} pageSize={6} />
      </div>
    </div>
  )
}

export default AuthorBlogs
