import { Button } from "@/components/ui/button"
import { SignIn } from "@clerk/nextjs"
import Link from "next/link"

import { Metadata } from "next"
export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "تسجيل الدخول إلى حسابك للاستفادة من خدماتنا.",
}

export default function SignInPage() {
  return (
    <div className="mx-auto -my-6 flex min-h-screen items-center justify-center px-8">
      <div className="flex w-fit items-center justify-center rounded-lg border-none px-4 py-4 shadow-none md:border-2 md:border-dashed md:shadow-lg">
        <div>
          <SignIn
            appearance={{
              elements: {
                footer: {
                  display: "none",
                },
              },
            }}
          />
        </div>
        <div className="bg-primary hidden h-[360px] w-[400px] flex-col items-center justify-center gap-6 rounded-lg px-6 shadow-2xl md:flex">
          <p className="text-lg font-semibold text-white">
            إذا لم تكن لديك حساب بعد، يمكنك إنشاء حساب جديد للاستفادة من
            خدماتنا.
          </p>
          <div className="w-full px-6">
            <Button asChild className="w-full" variant={"auth"}>
              <Link href={"/sign-up"}>إنشاء حساب</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
