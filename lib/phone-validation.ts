import { z } from "zod"
import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js"
import { NamesCountry } from "@/constants"

export const createClientPhoneSchema = (countryCode: CountryCode) => {
  return z.string().refine(
    (phone) => {
      if (!phone) return false

      const phoneNumber = parsePhoneNumberFromString(phone, countryCode)

      return Boolean(phoneNumber?.isValid())
    },
    {
      message: `يرجى إدخال رقم هاتف صحيح لـ ${NamesCountry[countryCode] || countryCode}`,
    }
  )
}

export const getCountryNameInArabic = (countryCode: string): string => {
  return NamesCountry[countryCode] || countryCode
}
