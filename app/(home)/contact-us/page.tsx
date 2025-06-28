import ContactUsForm from "@/components/form/contact-us-form"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import { navigationsIconsItems } from "@/constants"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "اتصل بنا",
  description: "لديك استفسار؟ نحن هنا للمساعدة. تواصل معنا الآن.",
}

const ContactUsPage = () => {
  return (
    <div className="flex flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:gap-16 md:py-16 lg:px-8">
      <div className="md:w-1/2">
        <p className="font-bold md:text-xl">
          إملأ الاستمارة أدناه وسنقوم بالرد عليك في أقرب وقت ممكن :
        </p>
        <ContactUsForm />
      </div>
      <div className="flex flex-col gap-8 md:mt-10 md:w-1/2">
        <div className="flex flex-col gap-3">
          <p className="font-bold md:text-xl">
            تابعنا على وسائل التواصل الاجتماعي :
          </p>
          <div className="flex gap-4">
            {navigationsIconsItems.map((item, index) => (
              <Link key={index} href={item.href} aria-label={item.label}>
                <div className="bg-primary hover:bg-secondary flex items-center justify-center rounded-full p-2 text-white transition-colors duration-200">
                  <item.icon className="size-4 md:size-6" />
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="font-bold md:text-xl">
            أو انقر على الزر أدناه للتواصل معنا عبر WhatsApp :
          </p>
          <div className="flex">
            <Button asChild className="md:w-1/2">
              <Link
                href="https://api.whatsapp.com/send?phone=1234567890&text=Hello%20there!"
                target="_blank"
                className="w-full md:w-1/2"
              >
                <Icons.whatsapp className="size-6" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUsPage
