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

export const userSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب").max(50, "الاسم طويل جدا"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true
        return /^[0-9]{10}$/.test(value)
      },
      {
        message: "رقم الهاتف التركي غير صالح، يجب أن يحتوي على 10 أرقام",
      }
    ),

  dateNaissance: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true
        return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value))
      },
      {
        message:
          "تاريخ الميلاد غير صالح، الرجاء استخدام التنسيق YYYY-MM-DD (مثال: 1990-08-15)",
      }
    ),
})

export const blogSchema = z.object({
  title: z
    .string()
    .min(5, "العنوان يجب أن يكون على الأقل 5 أحرف")
    .max(100, "العنوان لا يجب أن يتجاوز 100 حرف"),
  content: z.string().min(50, "المحتوى يجب أن يكون على الأقل 50 حرف"),
  type: z.enum(["ARTICLE", "RECHERCHE", "RAPPORT"], {
    required_error: "يرجى اختيار نوع المدونة",
  }),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
})

export const eventSchema = z.object({
  title: z.string().min(2, "عنوان الحدث مطلوب"),
  description: z.string().min(10, "وصف الحدث مطلوب"),
  date: z.string().min(1, "تاريخ الحدث مطلوب"),
  hour: z.string().min(2, "وقت الحدث مطلوب"),
  link: z.string().url("يجب أن يكون الرابط صحيحاً"),
  imageUrl: z.string().optional(),
})
