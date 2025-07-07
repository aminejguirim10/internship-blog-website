"use server"

import { prisma } from "@/lib/db"

export async function createNewsLetterUser(phoneNumber: string) {
  try {
    const existingUser = await prisma.newsletterUser.findUnique({
      where: { phoneNumber },
    })

    if (existingUser) {
      return {
        message: "هذا الرقم مسجل بالفعل في النشرة الإخبارية",
        status: 400,
      }
    }

    const newsLetterUser = await prisma.newsletterUser.create({
      data: {
        phoneNumber,
      },
    })

    return {
      message:
        "تم تسجيلك في النشرة الإخبارية بنجاح! ستصلك إشعارات بأحدث المدونات",
      status: 201,
      data: newsLetterUser,
    }
  } catch (error) {
    return {
      message:
        "حدث خطأ أثناء التسجيل في النشرة الإخبارية. يرجى المحاولة مرة أخرى",
      status: 500,
    }
  }
}
