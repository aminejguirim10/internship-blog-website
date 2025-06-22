"use server"

import { checkAdmin, checkUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import nodemailer from "nodemailer"

export const updateUser = async (
  userId: string,
  name: string,
  dateNaissance: string,
  phoneNumber: string
) => {
  const user = await checkUser()
  if (!user) {
    return { message: "User not authorized", status: 401 }
  }
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        dateNaissance,
        phoneNumber,
      },
    })
    revalidatePath("/profile")

    return { message: "User updated successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error updating user ", status: 500 }
  }
}

export const updatePhoto = async (image: string) => {
  const user = await checkUser()
  if (!user) {
    return { message: "User not authorized", status: 401 }
  }
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        image,
      },
    })
    revalidatePath("/profile")

    return { message: "Photo updated successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error updating photo", status: 500 }
  }
}

export const deleteUser = async (userId: string) => {
  const admin = await checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }
  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    })
    revalidatePath("/dashboard/users")
    return { message: "User deleted successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error deleting user", status: 500 }
  }
}

export const contactAdmin = async (
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAILER_AUTHOR_MAIL!,
        pass: process.env.NODE_MAILER_SECRET!,
      },
    })
    const mailOptions = {
      from: process.env.NODE_MAILER_AUTHOR_MAIL!,
      to: process.env.NODE_MAILER_AUTHOR_MAIL!,
      subject: `${subject}`,
      html: "hello", // TODO: add email template
    }

    await transporter.sendMail(mailOptions)
    return {
      message: "تم إرسال الرسالة بنجاح",
      status: 200,
    }
  } catch (error: any) {
    return {
      message: "حدث خطأ أثناء إرسال الرسالة",
      status: 500,
    }
  }
}
