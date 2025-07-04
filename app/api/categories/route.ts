import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "asc",
    },
    take: 3,
    select: {
      id: true,
      name: true,
    },
  })

  return NextResponse.json(categories)
}
