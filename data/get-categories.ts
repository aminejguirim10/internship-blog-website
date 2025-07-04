import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "asc",
    },
  })

  return categories
}

export async function getAllCategories() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  const categories = await prisma.category.findMany({
    include: {
      blogs: {
        select: {
          id: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return categories
}

export async function getCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  })

  return category
}

export async function getCategoriesMetrics() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  // Total categories
  const totalCategories = await prisma.category.count()

  // Categories this month
  const newCategoriesThisMonth = await prisma.category.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Categories last month
  const newCategoriesLastMonth = await prisma.category.count({
    where: {
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  })

  // Calculate growth
  const monthlyGrowth =
    newCategoriesLastMonth > 0
      ? ((newCategoriesThisMonth - newCategoriesLastMonth) /
          newCategoriesLastMonth) *
        100
      : newCategoriesThisMonth > 0
        ? 100
        : 0

  // Categories with blogs
  const categoriesWithBlogs = await prisma.category.count({
    where: {
      blogs: {
        some: {},
      },
    },
  })

  // Categories without blogs
  const categoriesWithoutBlogs = totalCategories - categoriesWithBlogs

  // Usage percentage
  const usagePercentage =
    totalCategories > 0 ? (categoriesWithBlogs / totalCategories) * 100 : 0

  // Average blogs per category
  const totalBlogs = await prisma.blog.count()
  const averageBlogsPerCategory =
    totalCategories > 0 ? totalBlogs / totalCategories : 0

  return {
    totalCategories,
    newCategoriesThisMonth,
    categoriesWithBlogs,
    categoriesWithoutBlogs,
    monthlyGrowth,
    usagePercentage,
    averageBlogsPerCategory,
  }
}

export async function getCategoriesChartData() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Récupérer les categories des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const categories = await prisma.category.findMany({
    where: {
      createdAt: {
        gte: ninetyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // Grouper les categories par date de création
  const chartData: {
    [key: string]: { categories: number }
  } = {}

  // Initialiser les 90 derniers jours avec des valeurs 0
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    chartData[dateKey] = { categories: 0 }
  }

  // Compter les categories par jour
  categories.forEach((category) => {
    const dateKey = category.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].categories++
    }
  })

  // Convertir en format tableau pour le graphique
  return Object.entries(chartData).map(([date, data]) => ({
    date,
    categories: data.categories,
  }))
}

export async function getHomeLatestCategories(rank: number = 1) {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "asc",
    },
    skip: rank - 1,
    take: 1,
  })

  return categories[0] || null
}
