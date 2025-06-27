"use server"

import { prisma } from "@/lib/db"
import { checkAdmin, checkEditor } from "@/lib/auth"

import { BlogType } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const createBlog = async (
  title: string,
  content: string,
  type: BlogType,
  image: string,
  tags: string[],
  authorId: string
) => {
  const editor = checkEditor()
  if (!editor) {
    return { message: "Editor not authenticated", status: 401 }
  }
  try {
    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        image,
        type,
        authorId,
        status: "PENDING",
        tags: { create: tags.map((tag) => ({ name: tag })) },
      },
    })
    return { message: "Blog created successfully", status: 201 }
  } catch (error: any) {
    return { message: "Error creating blog", status: 500 }
  }
}

export const deleteBlog = async (blogId: string) => {
  try {
    const admin = checkAdmin()
    if (!admin) {
      return { message: "Admin not authenticated", status: 401 }
    }

    await prisma.blog.delete({
      where: {
        id: blogId,
      },
    })
    revalidatePath("/dashboard")
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

  try {
    if (response === "REJECTED") {
      await prisma.blog.delete({
        where: { id: idBlog },
      })
      return { message: "Blog rejected and deleted successfully", status: 200 }
    } else if (response === "ACCEPTED") {
      await prisma.blog.update({
        where: { id: idBlog },
        data: { status: "ACCEPTED" },
      })
      return { message: "Blog accepted successfully", status: 200 }
    }
    return { message: "Blog response updated successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error responding to blog", status: 500 }
  }
}
