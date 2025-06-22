import { checkUser, checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import type { BlogType } from "@prisma/client"

export async function getLatestRapports(pageSize = 6) {
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

export async function getLatestRecherches(pageSize = 6) {
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

export async function getLatestArticles(pageSize = 6) {
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

export async function getMostViewedBlogs(pageSize = 3) {
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

  const rejectedBlogs = await prisma.blog.count({
    where: { type, status: "REJECTED" },
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
    rejectedBlogs,
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
    [key: string]: { blogs: number; accepted: number }
  } = {}

  // Initialiser les 90 derniers jours avec des valeurs 0
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    chartData[dateKey] = { blogs: 0, accepted: 0 }
  }

  // Compter les blogs par jour
  blogs.forEach((blog) => {
    const dateKey = blog.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].blogs++
      if (blog.status === "ACCEPTED") {
        chartData[dateKey].accepted++
      }
    }
  })

  // Convertir en format tableau pour le graphique
  return Object.entries(chartData).map(([date, data]) => ({
    date,
    blogs: data.blogs,
    accepted: data.accepted,
  }))
}

export const filterBlogs = async (
  title: string,
  type: "RAPPORT" | "RECHERCHE" | "ARTICLE",
  page = 1,
  pageSize = 10,
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
