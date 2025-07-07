"use server"

import { prisma } from "@/lib/db"
import { checkAdmin, checkEditor } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import nodemailer from "nodemailer"
import { responseBlogTemplate, createBlogTemplate } from "@/lib/email"
import { sendWhatsAppMessage } from "@/lib/twilio"

export const createBlog = async (
  title: string,
  content: string,
  categoryId: string,
  categoryName: string,
  image: string,
  tags: string[],
  authorId: string
) => {
  const editor = await checkEditor()
  if (!editor) {
    return { message: "Editor not authenticated", status: 401 }
  }
  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        image,
        categoryId,
        authorId,
        status: "PENDING",
        tags: { create: tags.map((tag) => ({ name: tag })) },
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
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
      subject: `📝 مدونة جديدة في انتظار المراجعة - ${title}`,
      html: createBlogTemplate(
        blog.author?.name!,
        blog.author?.email!,
        title,
        tags
      ),
    }
    await transporter.sendMail(mailOptions)

    return { message: "Blog created successfully", status: 201 }
  } catch (error: any) {
    return { message: "Error creating blog", status: 500 }
  }
}

export const deleteBlog = async (blogId: string) => {
  try {
    const editor = await checkEditor()
    if (!editor) {
      return { message: "Editor not authenticated", status: 401 }
    }

    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    })
    revalidatePath("/")
    return { message: "Blog deleted successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error deleting blog", status: 500 }
  }
}

export const responseBlog = async (
  idBlog: string,
  response: "ACCEPTED" | "REJECTED"
) => {
  const admin = await checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }

  const blog = await prisma.blog.findUnique({
    where: { id: idBlog },
    select: {
      author: { select: { email: true, name: true } },
      title: true,
    },
  })
  if (!blog) {
    return { message: "Blog not found", status: 404 }
  }

  try {
    if (response === "REJECTED") {
      await prisma.blog.delete({
        where: { id: idBlog },
      })
    } else if (response === "ACCEPTED") {
      await prisma.blog.update({
        where: { id: idBlog },
        data: { status: "ACCEPTED" },
      })
    }

    revalidatePath("/")
    setImmediate(async () => {
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
        to: blog.author?.email,
        subject: `${response === "ACCEPTED" ? "🎉 تم نشر مقالك!" : "📝 نتيجة مراجعة مقالك"} - ${blog.title}`,
        html: responseBlogTemplate(blog.author?.name!, response, blog.title),
      }

      await transporter.sendMail(mailOptions)

      if (response === "ACCEPTED") {
        const baseUrl = process.env.NEXT_URL
        const blogUrl = `${baseUrl}/blogs/${idBlog}`
        const message = `🎉 مدونة جديدة متاحة الآن!

📖 العنوان: ${blog.title}

✨ تم نشر مقال جديد على موقعنا ونحن متحمسون لمشاركته معكم!

🔗 ${blogUrl}

📱 شاركه مع أصدقائك ولا تنسى ترك تعليقك!

---
💡 للحصول على آخر التحديثات، تابعونا باستمرار

🌟 فريق المدونة`

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
      }
    })

    return { message: "Blog response updated successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error responding to blog", status: 500 }
  }
}
