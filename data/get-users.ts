import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getUsers(page: number = 1, pageSize: number = 10) {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }
  const users = await prisma.user.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  })
  return users
}
