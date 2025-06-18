import Link from "next/link"

import Image from "next/image"
import { Icons } from "@/components/shared/icons"
import { navigationItems, navigationsIconsItems } from "@/constants"
import NavbarSheet from "@/components/layout/navbar-sheet"

export default function Navbar({ type }: { type: "home" | "registered" }) {
  return (
    <header>
      <div className="mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
        <div className="text-primary flex items-center gap-2">
          <Icons.account className="size-6" />
          {type === "home" ? (
            <>
              <span className="hover:text-secondary transition-colors duration-200 hover:underline hover:underline-offset-8">
                <Link
                  href={"/sign-in"}
                  className="transition-colors duration-200"
                >
                  تسجيل الدخول
                </Link>
              </span>
              |
              <span className="hover:text-secondary transition-colors duration-200 hover:underline hover:underline-offset-8">
                <Link href={"/sign-up"}>إنشاء حساب</Link>
              </span>
            </>
          ) : (
            <span className="hover:text-secondary transition-colors duration-200 hover:underline hover:underline-offset-8">
              <Link href={"/profile"}>حسابي</Link>
            </span>
          )}
        </div>
        <div>
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={467}
              height={498}
              className="size-10"
            />
          </Link>
        </div>
        <div className="hidden gap-2 md:flex">
          {navigationsIconsItems.map((item, index) => (
            <Link key={index} href={item.href} aria-label={item.label}>
              <div className="bg-primary hover:bg-secondary flex items-center justify-center rounded-full p-2 text-white transition-colors duration-200">
                <item.icon className="size-5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-primary h-16">
        <div className="hidden h-full justify-center md:flex md:gap-6 lg:gap-12">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="hover:text-secondary flex items-center justify-center px-4 font-semibold text-white transition-colors duration-200 hover:underline hover:underline-offset-8 max-lg:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <NavbarSheet />
      </div>
    </header>
  )
}
