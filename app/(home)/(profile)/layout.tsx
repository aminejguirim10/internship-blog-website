import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"
import ProfileImage from "@/components/shared/profile-image"
import ProfileSideBar from "@/components/shared/profile-sidebar"

import { checkUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }
  return (
    <div>
      <ProfileImage user={user} />
      <section className="mx-auto flex flex-col gap-4 px-4 py-8 md:flex-row">
        <ProfileSideBar />
        {children}
      </section>
    </div>
  )
}
