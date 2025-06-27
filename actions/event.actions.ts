"use server"

import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export const createEvent = async (
  title: string,
  description: string,
  image: string,
  date: Date,
  link: string,
  hour: string
) => {
  const admin = checkAdmin()
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
    revalidatePath("/dashboard")
    return { message: "Event created successfully", status: 201 }
  } catch (error: any) {
    return { message: "Error creating event ", status: 500 }
  }
}

export const deleteEvent = async (eventId: string) => {
  const admin = checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }
  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    })
    revalidatePath("/dashboard")
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
  const admin = checkAdmin()
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
    revalidatePath("/dashboard/events")
    return { message: "Event updated successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error updating event ", status: 500 }
  }
}
