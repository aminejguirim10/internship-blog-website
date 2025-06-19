import ProfileForm from "@/components/form/profile-form"
import { checkUser } from "@/lib/auth"
import { redirect } from "next/navigation"

const ProfilePage = async () => {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }
  return (
    <div className="w-full pb-20 md:w-1/2">
      <ProfileForm user={user} />
    </div>
  )
}

export default ProfilePage
