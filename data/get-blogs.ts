import { checkUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getLatestRapports(pageSize: number = 6) {
  const rapports = await prisma.blog.findMany({
    where: {
      type: "RAPPORT",
      status: "ACCEPTED",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize,
  })
  return rapports
}

export async function getLatestRecherches(pageSize: number = 6) {
  const recherches = await prisma.blog.findMany({
    where: {
      type: "RECHERCHE",
      status: "ACCEPTED",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize,
  })
  return recherches
}

export async function getLatestArticles(pageSize: number = 6) {
  const articles = await prisma.blog.findMany({
    where: {
      type: "ARTICLE",
      status: "ACCEPTED",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize,
  })
  return articles
}

export async function getBlog(id: string) {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  const blog = await prisma.blog.findUnique({
    where: {
      id,
      status: "ACCEPTED",
    },
    select: {
      tags: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  })
  const viewsCount = await prisma.blogView.count({
    where: {
      blogId: id,
    },
  })

  return blog ? { ...blog, viewsCount } : null
}

export async function getMostViewedBlogs(pageSize: number = 3) {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      blogViews: {
        _count: "desc",
      },
    },
    take: pageSize,
  })
  return blogs
}

export const filterBlogs = async (
  title: string,
  type: "RAPPORT" | "RECHERCHE" | "ARTICLE",
  page: number = 1,
  pageSize: number = 10,
  date: Date | null = null,
  authorName: string | null = null
) => {
  const where: any = {
    type,
    status: "ACCEPTED",
  }

  if (title) {
    where.title = {
      contains: title,
      mode: "insensitive",
    }
  }

  if (date) {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    where.createdAt = {
      gte: startOfDay,
      lte: endOfDay,
    }
  }

  if (authorName) {
    where.author = {
      name: {
        contains: authorName,
        mode: "insensitive",
      },
    }
  }
  const blogs = await prisma.blog.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  return blogs
}
