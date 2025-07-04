import { Icons } from "@/components/shared/icons"
import { notFoundLinks } from "@/constants"
import Image from "next/image"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  description: "عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.",
}

export default function NotFoundPage() {
  return (
    <div className="bg-white">
      <main className="mx-auto w-full max-w-7xl px-6 pt-10 pb-16 sm:pb-24 lg:px-8">
        <div className="mx-auto w-fit self-center">
          <Link href={"/"}>
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={467}
              height={498}
              className="mx-auto size-12 w-auto sm:size-16"
            />
          </Link>
        </div>
        <div className="mx-auto mt-14 max-w-2xl text-center sm:mt-16">
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
            هذه الصفحة غير موجودة
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <ul
            role="list"
            className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5"
          >
            {notFoundLinks.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex gap-x-6 py-6">
                <div className="flex size-10 flex-none items-center justify-center rounded-lg shadow-xs ring-1 ring-gray-900/10">
                  <link.icon
                    aria-hidden="true"
                    className="text-primary size-6"
                  />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm/6 font-semibold text-gray-900">
                    <Link href={link.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {link.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm/6 text-gray-600">
                    {link.description}
                  </p>
                </div>
                <div className="flex-none self-center">
                  <Icons.chevronLeftIcon
                    aria-hidden="true"
                    className="size-5 text-gray-400"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="text-primary text-sm/6 font-semibold transition-colors duration-300 hover:underline hover:underline-offset-4"
            >
              العودة إلى الصفحة الرئيسية <span aria-hidden="true">&larr;</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
