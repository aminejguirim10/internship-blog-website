import { checkUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getEvents(pageSize: number = 4) {
  const events = await prisma.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize,
  })
  return events
}

export async function getEvent(id: string) {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }
  const event = await prisma.event.findUnique({
    where: {
      id,
    },
  })
  return event
}
