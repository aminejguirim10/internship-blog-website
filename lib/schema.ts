import { z } from "zod"

export const applicationSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(50, "الاسم طويل جدا"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  subject: z.string().min(5, "الموضوع مطلوب").max(500, "الموضوع طويل جدا"),
  bio: z
    .string({})
    .min(10, "السيرة الذاتية مطلوبة")
    .max(500, "السيرة الذاتية طويلة جدا"),
  exemple: z
    .string()
    .min(5, "مثال الكتابة مطلوب")
    .max(500, "مثال الكتابة طويل جدا"),
})

export const contactSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(50, "الاسم طويل جدا"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  subject: z.string().min(5, "الموضوع مطلوب").max(200, "الموضوع طويل جدا"),
  message: z.string().min(10, "الرسالة مطلوبة").max(1000, "الرسالة طويلة جدا"),
})
