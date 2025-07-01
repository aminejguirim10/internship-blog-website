"use client"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Icons } from "@/components/shared/icons"
import { navigationItems, navigationsIconsItems } from "@/constants"
import Link from "next/link"

const NavbarSheet = () => {
  return (
    <Sheet>
      <div className="flex h-full items-center justify-between rounded-full px-4 sm:px-6 md:hidden lg:px-8">
        <span className="text-lg font-semibold text-white">القائمة</span>
        <SheetTrigger className="hover:bg-secondary rounded-full px-2 py-2 transition-colors duration-200 hover:cursor-pointer">
          <Icons.menu className="size-6 text-white" />
        </SheetTrigger>
      </div>
      <SheetContent side="right" className="w-[300px] bg-white">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold text-gray-900">
            القائمة الرئيسية
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-2">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-3 border-t border-gray-200 pt-6">
          <h3 className="mb-3 px-4 text-sm font-medium text-gray-500">
            تابعنا على
          </h3>
          <div className="flex justify-center gap-2">
            {navigationsIconsItems.map((item, index) => (
              <Link key={index} href={item.href} aria-label={item.label}>
                <div className="bg-primary hover:bg-secondary flex items-center justify-center rounded-full p-2 text-white transition-colors duration-200">
                  <item.icon className="size-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default NavbarSheet
