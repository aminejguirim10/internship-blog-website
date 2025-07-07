"use server"

import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { sendWhatsAppMessage } from "@/lib/twilio"

export const createEvent = async (
  title: string,
  description: string,
  image: string,
  date: Date,
  link: string,
  hour: string
) => {
  const admin = await checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }
  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        image,
        date,
        link,
        hour,
      },
    })

    revalidatePath("/")

    setImmediate(async () => {
      const baseUrl = process.env.NEXT_URL
      const eventUrl = `${baseUrl}/events/${event.id}`
      const eventDate = new Date(date).toLocaleDateString("fr-FR")

      const message = `🎪 فعالية جديدة !

🎯 العنوان: ${title}

📅 التاريخ: ${eventDate}
⏰ الوقت: ${hour}

📝 تم إضافة فعالية جديدة مميزة لا تفوتوها!

🔗 ${eventUrl}

📲 سجل مشاركتك الآن ولا تفوت هذه الفرصة!

---
🌟 نراكم قريباً في الفعالية

🎉 فريق الفعاليات`

      const users = await prisma.newsletterUser.findMany({
        select: {
          phoneNumber: true,
        },
      })

      if (users.length > 0) {
        for (const user of users) {
          await sendWhatsAppMessage(user.phoneNumber, message)
        }
      }
    })

    return { message: "Event created successfully", status: 201 }
  } catch (error: any) {
    return { message: "Error creating event ", status: 500 }
  }
}

export const deleteEvent = async (eventId: string) => {
  const admin = await checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }
  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    })
    revalidatePath("/")
    return { message: "Event deleted successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error deleting event ", status: 500 }
  }
}

export const updateEvent = async (
  eventId: string,
  title: string,
  description: string,
  image: string,
  date: Date,
  link: string,
  hour: string
) => {
  const admin = await checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }
  try {
    const updatedEvent = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        description,
        image,
        date,
        link,
        hour,
      },
    })
    revalidatePath("/")
    return { message: "Event updated successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error updating event ", status: 500 }
  }
}
