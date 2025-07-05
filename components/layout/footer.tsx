import Link from "next/link"
import Image from "next/image"
import {
  instituteLinks,
  navigationsIconsItems,
  reportsLinks,
  researchLinks,
} from "@/constants"
import { Icons } from "@/components/shared/icons"

export default function Footer() {
  return (
    <footer className="bg-primary text-white" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="mb-6">
            <div className="mb-4 flex h-1/4 w-fit items-center justify-center rounded-full bg-white px-2 py-2">
              <Link href="/" className="">
                <Image
                  src="/assets/logonav.png"
                  alt="Logo"
                  width={467}
                  height={498}
                  className="size-7"
                />
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Icons.location className="ml-3 size-5 flex-shrink-0" />
                <span>TURKEY/ ISTANBUL</span>
              </div>
              <div className="flex items-center">
                <Icons.phone className="ml-3 size-5 flex-shrink-0" />
                <span dir="ltr">00 915 522 688</span>
              </div>
              <div className="flex items-center">
                <Icons.email className="ml-3 size-5 flex-shrink-0" />
                <a
                  href="mailto:xample@contactus.com"
                  className="hover:text-secondary text-white transition-colors duration-200 hover:underline hover:underline-offset-8"
                >
                  <span className="break-all">example@contactus.com</span>
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-bold">المعهد</h3>
            <ul className="space-y-3">
              {instituteLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center text-white"
                  >
                    <span className="ml-2">•</span>
                    <span className="hover:text-secondary transition-colors duration-200 hover:underline hover:underline-offset-8">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-bold">أبحاث</h3>
            <ul className="space-y-3">
              {researchLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center text-white"
                  >
                    <span className="ml-2">•</span>
                    <span className="hover:text-secondary transition-colors duration-200 hover:underline hover:underline-offset-8">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-2xl font-bold">تقارير</h3>
            <ul className="space-y-3">
              {reportsLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="flex items-center text-white"
                  >
                    <span className="ml-2">•</span>
                    <span className="hover:text-secondary transition-colors duration-200 hover:underline hover:underline-offset-8">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-8 border-t border-white pt-8">
          <h3 className="mb-6 text-center text-xl font-bold md:text-2xl lg:text-3xl">
            مواقع التواصل الاجتماعي
          </h3>
          <div className="flex items-center justify-center gap-4">
            {navigationsIconsItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                aria-label={item.label}
                target="_blank"
              >
                <div className="bg-primary hover:bg-secondary flex items-center justify-center rounded-full p-2 text-white transition-colors duration-200">
                  <item.icon className="size-6 md:size-7" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t pt-6 text-center text-sm">
          <p className="leading-relaxed">
            جميع الحقوق محفوظة للمركز ولا يجوز الاستفادة منها دون الاشارة الى
            المركز أو أخذ الاذن من إدارته. جميع المقالات والاوراق التي تنشر في
            قسم آراء تعبر عن رأي كتابها ولا تعكس بالضرورة وجهة نظر المركز .
            <span className="mr-4 font-semibold">
              {new Date().getFullYear()} &copy;
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
