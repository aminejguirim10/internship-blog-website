import { cache } from "react"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "./db"

export const checkUser = cache(async () => {
  const user = await currentUser()
  if (!user) {
    return null
  }

  const prismaUser = await prisma.user.findUnique({
    where: {
      clerkId: user.id,
    },
  })
  if (prismaUser) {
    return prismaUser
  }

  const newUser = await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
      name: user.username || user.emailAddresses[0]?.emailAddress.split("@")[0],
      image: user.imageUrl || "",
    },
  })

  return newUser
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
      role: "EDITOR",
      clerkId: user.clerkId,
    },
  })
  return editor ? editor : null
})
