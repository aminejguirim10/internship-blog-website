"use server"

import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export const createCategory = async (name: string) => {
  const admin = await checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }
  try {
    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    })
    if (existingCategory) {
      return { message: "Category with this name already exists", status: 400 }
    }

    const category = await prisma.category.create({
      data: {
        name,
      },
    })
    revalidatePath("/")
    return { message: "Category created successfully", status: 201 }
  } catch (error: any) {
    return { message: "Error creating category ", status: 500 }
  }
}

export const deleteCategory = async (categoryId: string) => {
  const admin = await checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }
  try {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    })

    revalidatePath("/")
    return { message: "Category deleted successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error deleting category ", status: 500 }
  }
}

export const updateCategory = async (categoryId: string, name: string) => {
  const admin = await checkAdmin()
  if (!admin) {
    return { message: "Admin not authenticated", status: 401 }
  }
  try {
    const existingCategory = await prisma.category.findUnique({
      where: {
        name,
      },
    })
    if (existingCategory && existingCategory.id !== categoryId) {
      return { message: "Category with this name already exists", status: 400 }
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name,
      },
    })

    revalidatePath("/")
    return { message: "Category updated successfully", status: 200 }
  } catch (error: any) {
    return { message: "Error updating category ", status: 500 }
  }
}
