"use client"

import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { profileNavigationItems } from "@/constants"
import { Icons } from "./icons"

export default function ProfileSideBar() {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div
      className="w-64 border-l border-gray-200 border-l-gray-300 bg-white p-4"
      dir="rtl"
    >
      <nav className="space-y-6">
        {profileNavigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50",
                isActive
                  ? "border-r-2 border-green-500 bg-green-50 text-green-700"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  isActive ? "text-green-600" : "text-gray-400"
                )}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="flex w-full items-center justify-start gap-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Icons.logout className="mr-[6px] size-5" />
          <span>تسجيل خروج</span>
        </Button>
      </nav>
    </div>
  )
}
