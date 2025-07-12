import { cache } from "react"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "./db"

export const checkUser = cache(async () => {
  const { userId } = await auth()
  if (!userId) return null
  const prismaUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  })
  return prismaUser
})

export const checkAdmin = cache(async () => {
  const user = await checkUser()
  if (!user) {
    return null
  }
  const admin = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
      clerkId: user.clerkId,
    },
  })
  return admin ? admin : null
})

export const checkEditor = cache(async () => {
  const user = await checkUser()
  if (!user) {
    return null
  }
  const editor = await prisma.user.findFirst({
    where: {
      role: { in: ["EDITOR", "ADMIN"] },
      clerkId: user.clerkId,
    },
  })
  return editor ? editor : null
})
