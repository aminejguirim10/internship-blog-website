import { checkUser, checkAdmin, checkEditor } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

export async function getLatestBlogs(
  pageSize = 6,
  categoryId: string,
  blogId?: string
) {
  const where: any = {
    categoryId,
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

export async function getHomeLatestBlogs(
  rank: number = 1,
  pageSize: number = 6
) {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
    },
  })

  if (categories.length < rank || rank < 1) {
    return []
  }

  const categoryId = categories[rank - 1].id

  const blogs = await prisma.blog.findMany({
    where: {
      categoryId,
      status: "ACCEPTED",
    },
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

export async function getAllBlogsByType(categoryId: string) {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  const blogs = await prisma.blog.findMany({
    where: {
      categoryId,
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

export async function getEditorAllBlogsByType(
  categoryId: string,
  authorId: string
) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }

  const blogs = await prisma.blog.findMany({
    where: {
      categoryId,
      authorId,
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
  const headersList = await headers()

  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    "unknown"

  const blog = await prisma.blog.findUnique({
    where: {
      id,
      status: "ACCEPTED",
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
      blogId_ipAddress: {
        blogId: id,
        ipAddress,
      },
    },
    update: {},
    create: {
      blogId: id,
      ipAddress,
    },
  })

  const viewsCount = await prisma.blogView.count({
    where: {
      blogId: id,
    },
  })

  return blog ? { ...blog, viewsCount } : null
}

export async function getMostViewedBlogs(pageSize = 3, categoryId: string) {
  const blogs = await prisma.blog.findMany({
    where: {
      categoryId,
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

export async function getBlogMetrics(categoryId: string) {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Total blogs of this type
  const totalBlogs = await prisma.blog.count({
    where: { categoryId },
  })

  // Blogs ce mois-ci
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const newBlogsThisMonth = await prisma.blog.count({
    where: {
      categoryId,
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
      categoryId,
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
    where: { categoryId, status: "ACCEPTED" },
  })

  const pendingBlogs = await prisma.blog.count({
    where: { categoryId, status: "PENDING" },
  })

  // Total views for this categoryId
  const totalViews = await prisma.blogView.count({
    where: {
      blog: { categoryId },
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

export async function getEditorBlogMetrics(
  categoryId: string,
  authorId: string
) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }

  // Date du début du mois actuel
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Total blogs ce mois-ci pour cet éditeur et ce type
  const totalBlogsThisMonth = await prisma.blog.count({
    where: {
      categoryId,
      authorId,
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Blogs acceptés pour cet éditeur et ce type
  const blogsAccepted = await prisma.blog.count({
    where: {
      categoryId,
      authorId,
      status: "ACCEPTED",
    },
  })

  // Blogs en attente pour cet éditeur et ce type
  const blogsPending = await prisma.blog.count({
    where: {
      categoryId,
      authorId,
      status: "PENDING",
    },
  })

  // Vues ce mois-ci pour tous les blogs de cet éditeur de ce type
  const viewsThisMonth = await prisma.blogView.count({
    where: {
      blog: {
        categoryId,
        authorId,
      },
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Total de tous les blogs de cet éditeur pour ce type (pour calculer des pourcentages si nécessaire)
  const totalBlogs = await prisma.blog.count({
    where: {
      categoryId,
      authorId,
    },
  })

  // Taux d'acceptation pour cet éditeur
  const acceptanceRate =
    totalBlogs > 0 ? Math.round((blogsAccepted / totalBlogs) * 100) : 0

  return {
    totalBlogsThisMonth,
    blogsAccepted,
    blogsPending,
    viewsThisMonth,
    totalBlogs,
    acceptanceRate,
  }
}

export async function getBlogChartData(categoryId: string) {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Récupérer les blogs des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const blogs = await prisma.blog.findMany({
    where: {
      categoryId,
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

export async function getEditorBlogChartData(
  categoryId: string,
  authorId: string
) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }

  // Récupérer les blogs de cet éditeur des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const blogs = await prisma.blog.findMany({
    where: {
      categoryId,
      authorId,
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
  categoryId: string,
  page = 1,
  pageSize = 10,
  date: Date | null,
  authorName: string | null
) => {
  const where: any = {
    status: "ACCEPTED",
  }

  // Ajouter le filtre categoryId seulement s'il est fourni
  if (categoryId) {
    where.categoryId = categoryId
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
  pageSize = 6
) => {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  const where: any = {
    authorId,
    status: "ACCEPTED",
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
