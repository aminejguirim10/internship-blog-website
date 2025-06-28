import { Button } from "@/components/ui/button"
import { SignUp } from "@clerk/nextjs"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "إنشاء حساب جديد للاستفادة من خدماتنا.",
}

export default function SignUpPage() {
  return (
    <div className="mx-auto -my-6 flex min-h-screen items-center justify-center px-8">
      <div className="flex w-fit items-center justify-center rounded-lg border-none px-4 py-4 shadow-none md:border-2 md:border-dashed md:shadow-lg">
        <div className="bg-primary hidden h-[438px] w-[280px] flex-col items-center justify-center gap-6 rounded-lg px-6 shadow-2xl md:flex">
          <p className="text-lg font-semibold text-white">
            إذا كان لديك حساب بالفعل.
          </p>
          <div className="w-full px-6">
            <Button asChild className="w-full" variant={"auth"}>
              <Link href={"/sign-in"}>تسجيل الدخول</Link>
            </Button>
          </div>
        </div>
        <div>
          <SignUp
            appearance={{
              elements: {
                footer: {
                  display: "none",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
