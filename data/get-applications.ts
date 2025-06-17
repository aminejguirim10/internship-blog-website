import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getApplications(page: number = 1, pageSize: number = 10) {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  const applications = await prisma.application.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  })
  return applications
}
