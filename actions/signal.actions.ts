"use server"

import { checkUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createSignalTemplate } from "@/lib/email"
import nodemailer from "nodemailer"

export async function createSignal(commentId: string) {
  try {
    const user = await checkUser()
    if (!user) {
      return {
        message: "يجب تسجيل الدخول لإضافة تقرير",
        status: 401,
      }
    }

    const existingSignal = await prisma.signal.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id,
        },
      },
    })

    if (existingSignal) {
      return {
        message: "لقد قمت بالإبلاغ عن هذا التعليق من قبل",
        status: 400,
      }
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        author: true,
        blog: {
          include: {
            author: true,
          },
        },
      },
    })

    if (!comment) {
      return {
        message: "التعليق غير موجود",
        status: 404,
      }
    }

    // Create the signal in the database
    const signal = await prisma.signal.create({
      data: {
        commentId,
        userId: user.id,
      },
    })

    // Send the email in the background (without waiting)
    const blogPath = `${process.env.NEXT_URL}/blogs/${comment.blog.id}`

    // Use setImmediate to execute the email sending asynchronously
    setImmediate(async () => {
      const emailTemplate = createSignalTemplate(
        user.name || "مستخدم مجهول",
        user.email,
        comment.content,
        comment.author.name || "مستخدم مجهول",
        comment.blog.title,
        blogPath
      )

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
        subject: `⚠️ تقرير تعليق جديد - ${comment.blog.title}`,
        html: emailTemplate,
      }

      await transporter.sendMail(mailOptions)
    })

    // Return the response immediately
    return {
      message: "تم إرسال التقرير بنجاح",
      status: 201,
    }
  } catch (error) {
    return {
      message: "حدث خطأ أثناء إرسال التقرير",
      status: 500,
    }
  }
}
