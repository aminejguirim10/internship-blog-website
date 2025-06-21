"use server"

import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import nodemailer from "nodemailer"

export const createApplication = async (
  name: string,
  email: string,
  subject: string,
  bio: string,
  exemple: string
) => {
  try {
    const applicationExists = await prisma.application.findFirst({
      where: {
        email,
      },
    })

    if (applicationExists) {
      return {
        message: "هذا البريد الإلكتروني مرتبط بالفعل بطلب سابق",
        status: 400,
      }
    }

    const application = await prisma.application.create({
      data: {
        name,
        email,
        subject,
        bio,
        exemple,
      },
    })

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
      subject: `New application request from ${name}`,
      html: "hello", // TODO: add email template
    }

    await transporter.sendMail(mailOptions)
    revalidatePath("/admin")
    return {
      message: "تم إنشاء الطلب بنجاح",
      status: 200,
    }
  } catch (error: any) {
    return {
      message: "حدث خطأ أثناء إنشاء الطلب",
      status: 500,
    }
  }
}

export const responseApplication = async (
  applicationId: string,
  response: "ACCEPTED" | "REJECTED"
) => {
  try {
    const admin = await checkAdmin()
    if (!admin) {
      return { message: "Admin not authenticated", status: 401 }
    }

    const application = await prisma.application.delete({
      where: { id: applicationId },
    })

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
      to: application.email,
      subject: `Your application has been ${response.toLowerCase()}`,
      html: "hello", // TODO: add email template
    }

    await transporter.sendMail(mailOptions)
    revalidatePath("/admin")
    return {
      message: `Application ${response.toLowerCase()}`,
      status: 200,
    }
    //Todo: create the editor if response is ACCEPTED
  } catch (error: any) {
    return {
      message: "Error responding to application ",
      status: 500,
    }
  }
}
