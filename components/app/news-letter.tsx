"use client"

import { useState } from "react"
import { PhoneInput } from "@/components/ui/phone-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { z } from "zod"
import { createNewsLetterUser } from "@/actions/newsletter.actions"
import {
  createClientPhoneSchema,
  getCountryNameInArabic,
} from "@/lib/phone-validation"
import {
  Loader2,
  Bell,
  MessageCircle,
  CheckCircle2,
  Smartphone,
} from "lucide-react"
import type { Value as PhoneValue } from "react-phone-number-input"
import type { Country } from "react-phone-number-input"

const NewsLetter = () => {
  const [phoneNumber, setPhoneNumber] = useState<PhoneValue>()
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<Country>("TR")

  const handleCountryChange = (country?: Country) => {
    if (country) {
      setSelectedCountry(country)
    }
  }

  const handleSubscribe = async () => {
    if (!phoneNumber) {
      toast.error("يرجى إدخال رقم الهاتف")
      return
    }

    try {
      const phoneSchema = createClientPhoneSchema(selectedCountry)
      phoneSchema.parse(phoneNumber)
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(
          error.errors[0]?.message || "رقم الهاتف غير صحيح للبلد المختار",
          {
            duration: 4000,
            description: `الرقم المدخل لا يتطابق مع صيغة أرقام ${getCountryNameInArabic(selectedCountry)}`,
          }
        )
        return
      }
    }

    setIsSubscribing(true)

    try {
      const result = await createNewsLetterUser(phoneNumber)

      switch (result.status) {
        case 201:
          toast.success(result.message, {
            duration: 5000,
            description: `تم تسجيل الرقم  بنجاح`,
          })
          setPhoneNumber(undefined)
          break

        case 400:
          toast.error(result.message, {
            duration: 4000,
            description: "يمكنك التحقق من حالة اشتراكك أو استخدام رقم آخر",
          })
          break

        case 500:
          toast.error(result.message, {
            duration: 4000,
            description: "يرجى المحاولة مرة أخرى بعد قليل",
          })
          break

        default:
          toast.error("حدث خطأ غير متوقع", {
            duration: 4000,
          })
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال", {
        duration: 4000,
        description: "تحقق من اتصالك بالإنترنت وحاول مرة أخرى",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12" dir="rtl">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
            <Bell className="h-6 w-6" />
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
          اشترك في النشرة الإخبارية
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          كن أول من يعلم بأحدث المدونات والمقالات المنشورة على موقعنا. سنرسل لك
          إشعارات فورية عبر الواتساب (يدعم جميع البلدان)
        </p>
      </div>

      <Card className="border-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-xl ring-1 ring-slate-200/50">
        <CardContent className="p-8">
          <div className="flex flex-col gap-2">
            <div className="space-y-6">
              <div className="rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-green-100/50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-green-900">
                  <Smartphone className="h-6 w-6" />
                  مميزات الاشتراك
                </h3>
                <ul className="space-y-3 text-green-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                    <span>إشعارات فورية بأحدث المدونات</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                    <span>محتوى حصري للمشتركين فقط</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
                    <span>إشعارات عن الفعاليات والندوات</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6">
                <h3 className="mb-3 text-lg font-bold text-blue-900">
                  لماذا الواتساب؟
                </h3>
                <p className="text-blue-800">
                  نستخدم الواتساب لضمان وصول الإشعارات إليك فوراً ولسهولة
                  التفاعل. نقبل أرقام من جميع البلدان مع التحقق من صحتها.
                </p>
              </div>

              <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/50 p-6">
                <h3 className="mb-3 text-lg font-bold text-purple-900">
                  خصوصيتك مهمة
                </h3>
                <p className="text-purple-800">
                  نحترم خصوصيتك ولن نشارك بياناتك مع أطراف ثالثة. ستُستخدم
                  معلوماتك فقط لإرسال النشرة الإخبارية.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold text-slate-700">
                  رقم الواتساب *
                </Label>
                <PhoneInput
                  disabled={isSubscribing}
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  onCountryChange={handleCountryChange}
                  defaultCountry="TR"
                  placeholder="أدخل رقم الواتساب"
                  className="w-full"
                />
                <p className="text-sm text-slate-500">
                  سنرسل الإشعارات على هذا الرقم (الدولة المختارة:{" "}
                  {getCountryNameInArabic(selectedCountry)} - {selectedCountry})
                </p>
              </div>

              <Button
                onClick={handleSubscribe}
                disabled={isSubscribing || !phoneNumber}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-base font-semibold shadow-md transition-all duration-200 hover:cursor-pointer hover:from-blue-700 hover:to-purple-700 hover:shadow-lg disabled:opacity-50"
              >
                {isSubscribing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الاشتراك...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    اشترك الآن
                  </div>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewsLetter
