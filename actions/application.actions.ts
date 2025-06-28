"use server"

import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import nodemailer from "nodemailer"
import { createClerkClient } from "@clerk/nextjs/server"
import { generateTempPassword } from "@/lib/utils"
import {
  createApplicationTemplate,
  responseApplicationTemplate,
} from "@/lib/email"

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export const createApplication = async (
  name: string,
  email: string,
  subject: string,
  bio: string,
  exemple: string
) => {
  try {
    const editorExists = await prisma.user.findFirst({
      where: {
        email,
        role: "EDITOR",
      },
    })

    if (editorExists) {
      return {
        message: "هذا البريد الإلكتروني مرتبط بالفعل بمحرر",
        status: 400,
      }
    }

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
      subject: `طلب تقديم جديد من ${name}`,
      html: createApplicationTemplate(name, email, subject, bio, exemple),
    }

    await transporter.sendMail(mailOptions)
    revalidatePath("/dashboard")
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

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!application) {
      return { message: "Application not found", status: 404 }
    }

    if (response === "ACCEPTED") {
      const clerkUsers = await clerk.users.getUserList({
        emailAddress: [application.email],
      })

      let clerkUser
      if (clerkUsers.data.length > 0) {
        clerkUser = clerkUsers.data[0]
        const existingUser = await prisma.user.findUnique({
          where: { clerkId: clerkUser.id },
        })

        if (existingUser) {
          if (existingUser.role === "EDITOR") {
            return {
              message: "User is already an editor",
              status: 422,
            }
          }
          await prisma.user.update({
            where: { clerkId: clerkUser.id },
            data: { role: "EDITOR" },
          })
        } else {
          await prisma.user.create({
            data: {
              clerkId: clerkUser.id,
              email: application.email,
              name: application.name || clerkUser.firstName,
              image: clerkUser.imageUrl || "",
              role: "EDITOR",
            },
          })
        }
      } else {
        const tempPassword = generateTempPassword()
        clerkUser = await clerk.users.createUser({
          emailAddress: [application.email],
          firstName: application.name,
          password: tempPassword,
        })

        await prisma.user.create({
          data: {
            clerkId: clerkUser.id,
            email: application.email,
            name: application.name || clerkUser.firstName,
            image: clerkUser.imageUrl || "",
            role: "EDITOR",
          },
        })
      }
    }

    await prisma.application.delete({
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
      subject: `${response === "ACCEPTED" ? "🎉 مبروك! تم قبول طلبك كمحرر" : "📝 نتيجة مراجعة طلبك للانضمام"}`,
      html: responseApplicationTemplate(application.name, response),
    }

    await transporter.sendMail(mailOptions)
    revalidatePath("/dashboard")
    return {
      message: `Application ${response.toLowerCase()} successfully`,
      status: 200,
    }
  } catch (error: any) {
    return {
      message: `Email sending failed}`,
      status: 500,
    }
  }
}
