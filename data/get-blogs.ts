import { checkUser, checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import type { BlogType } from "@prisma/client"

export async function getLatestBlogs(
  pageSize = 6,
  type: BlogType,
  blogId?: string
) {
  const where: any = {
    type,
    status: "ACCEPTED",
  }

  if (blogId) {
    where.id = { not: blogId }
  }

  const blogs = await prisma.blog.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    take: pageSize,
  })

  return blogs
}

export async function getAllBlogsByType(type: BlogType) {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  const blogs = await prisma.blog.findMany({
    where: {
      type,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      tags: true,
      _count: {
        select: {
          blogViews: true,
        },
      },
    },
  })

  return blogs
}

export async function getBlog(id: string, type: BlogType) {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  const blog = await prisma.blog.findUnique({
    where: {
      id,
      status: "ACCEPTED",
      type,
    },
    include: {
      tags: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  await prisma.blogView.upsert({
    where: {
      blogId_userId: {
        blogId: id,
        userId: user.id,
      },
    },
    update: {},
    create: {
      blogId: id,
      userId: user.id,
    },
  })

  const viewsCount = await prisma.blogView.count({
    where: {
      blogId: id,
    },
  })

  return blog ? { ...blog, viewsCount } : null
}

export async function getMostViewedBlogs(pageSize = 3, type: BlogType) {
  const blogs = await prisma.blog.findMany({
    where: {
      type,
      status: "ACCEPTED",
    },
    orderBy: {
      blogViews: {
        _count: "desc",
      },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    take: pageSize,
  })
  return blogs
}

export async function getBlogMetrics(type: BlogType) {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Total blogs of this type
  const totalBlogs = await prisma.blog.count({
    where: { type },
  })

  // Blogs ce mois-ci
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const newBlogsThisMonth = await prisma.blog.count({
    where: {
      type,
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Blogs le mois dernier pour calculer la croissance
  const startOfLastMonth = new Date()
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)
  startOfLastMonth.setDate(1)
  startOfLastMonth.setHours(0, 0, 0, 0)

  const endOfLastMonth = new Date()
  endOfLastMonth.setDate(0)
  endOfLastMonth.setHours(23, 59, 59, 999)

  const lastMonthBlogs = await prisma.blog.count({
    where: {
      type,
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  })

  // Calcul de la croissance mensuelle
  const monthlyGrowth =
    lastMonthBlogs > 0
      ? ((newBlogsThisMonth - lastMonthBlogs) / lastMonthBlogs) * 100
      : newBlogsThisMonth > 0
        ? 100
        : 0

  // Blogs by status
  const acceptedBlogs = await prisma.blog.count({
    where: { type, status: "ACCEPTED" },
  })

  const pendingBlogs = await prisma.blog.count({
    where: { type, status: "PENDING" },
  })

  // Total views for this type
  const totalViews = await prisma.blogView.count({
    where: {
      blog: { type },
    },
  })

  // Acceptance rate
  const acceptanceRate =
    totalBlogs > 0 ? Math.round((acceptedBlogs / totalBlogs) * 100) : 0

  return {
    totalBlogs,
    newBlogsThisMonth,
    acceptedBlogs,
    pendingBlogs,
    totalViews,
    monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    acceptanceRate,
  }
}

export async function getBlogChartData(type: BlogType) {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Récupérer les blogs des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const blogs = await prisma.blog.findMany({
    where: {
      type,
      createdAt: {
        gte: ninetyDaysAgo,
      },
    },
    select: {
      createdAt: true,
      status: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // Grouper les blogs par date
  const chartData: {
    [key: string]: { blogs: number }
  } = {}

  // Initialiser les 90 derniers jours avec des valeurs 0
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    chartData[dateKey] = { blogs: 0 }
  }

  // Compter les blogs par jour
  blogs.forEach((blog) => {
    const dateKey = blog.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].blogs++
    }
  })

  // Convertir en format tableau pour le graphique
  return Object.entries(chartData).map(([date, data]) => ({
    date,
    blogs: data.blogs,
  }))
}

export const filterBlogs = async (
  title: string | null,
  type: "RAPPORT" | "RECHERCHE" | "ARTICLE" | null,
  page = 1,
  pageSize = 10,
  date: Date | null,
  authorName: string | null
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

  const totalCount = await prisma.blog.count({ where })

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

  return { blogs, totalCount }
}

export const getBlogsByAuthor = async (
  authorId: string,
  page = 1,
  pageSize = 6,
  type?: BlogType
) => {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  const where: any = {
    authorId,
    status: "ACCEPTED",
  }

  if (type) {
    where.type = type
  }

  const totalCount = await prisma.blog.count({ where })

  const blogs = await prisma.blog.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })

  return {
    blogs,
    totalCount,
    hasMore: page * pageSize < totalCount,
    nextPage: page * pageSize < totalCount ? page + 1 : null,
  }
}
