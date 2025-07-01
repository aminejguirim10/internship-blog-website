"use server"

import { checkUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createComment(blogId: string, content: string) {
  try {
    const user = await checkUser()
    if (!user) {
      return {
        success: false,
        message: "يجب تسجيل الدخول لإضافة تعليق",
        status: 401,
      }
    }

    if (!content.trim()) {
      return {
        success: false,
        message: "محتوى التعليق مطلوب",
        status: 400,
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        blogId,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            clerkId: true,
          },
        },
      },
    })

    revalidatePath("/")

    return {
      success: true,
      message: "تم إضافة التعليق بنجاح",
      status: 200,
      data: comment,
    }
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء إضافة التعليق",
      status: 500,
    }
  }
}

export async function updateComment(commentId: string, content: string) {
  try {
    const user = await checkUser()
    if (!user) {
      return {
        success: false,
        message: "يجب تسجيل الدخول لتعديل التعليق",
        status: 401,
      }
    }

    if (!content.trim()) {
      return {
        success: false,
        message: "محتوى التعليق مطلوب",
        status: 400,
      }
    }

    if (content.length > 500) {
      return {
        success: false,
        message: "التعليق لا يجب أن يتجاوز 500 حرف",
        status: 400,
      }
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, blogId: true },
    })

    if (!existingComment) {
      return {
        success: false,
        message: "التعليق غير موجود",
        status: 404,
      }
    }

    if (existingComment.authorId !== user.id) {
      return {
        success: false,
        message: "غير مصرح لك بتعديل هذا التعليق",
        status: 403,
      }
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: content.trim(),
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    revalidatePath("/")

    return {
      success: true,
      message: "تم تعديل التعليق بنجاح",
      status: 200,
      data: updatedComment,
    }
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء تعديل التعليق",
      status: 500,
    }
  }
}

export async function deleteComment(commentId: string) {
  try {
    const user = await checkUser()
    if (!user) {
      return {
        success: false,
        message: "يجب تسجيل الدخول",
        status: 401,
      }
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, blogId: true },
    })

    if (!comment) {
      return {
        success: false,
        message: "التعليق غير موجود",
        status: 404,
      }
    }

    if (comment.authorId !== user.id && user.role !== "ADMIN") {
      return {
        success: false,
        message: "غير مصرح لك بحذف هذا التعليق",
        status: 403,
      }
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    revalidatePath("/")

    return {
      success: true,
      message: "تم حذف التعليق بنجاح",
      status: 200,
    }
  } catch (error) {
    return {
      success: false,
      message: "حدث خطأ أثناء حذف التعليق",
      status: 500,
    }
  }
}
