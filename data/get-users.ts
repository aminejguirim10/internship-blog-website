import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getUsers(page = 1, pageSize = 10) {
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

export async function getAllUsers() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return users
}

export async function getUsersMetrics() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Total users
  const totalUsers = await prisma.user.count()

  // Users ce mois-ci
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const newUsersThisMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Users le mois dernier pour calculer la croissance
  const startOfLastMonth = new Date()
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)
  startOfLastMonth.setDate(1)
  startOfLastMonth.setHours(0, 0, 0, 0)

  const endOfLastMonth = new Date()
  endOfLastMonth.setDate(0)
  endOfLastMonth.setHours(23, 59, 59, 999)

  const lastMonthUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  })

  // Calcul de la croissance mensuelle
  const monthlyGrowth =
    lastMonthUsers > 0
      ? ((newUsersThisMonth - lastMonthUsers) / lastMonthUsers) * 100
      : newUsersThisMonth > 0
        ? 100
        : 0

  // Users actifs (derniers 7 jours)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const activeUsers = await prisma.user.count({
    where: {
      updatedAt: {
        gte: sevenDaysAgo,
      },
    },
  })

  // Distribution des rôles
  const adminUsers = await prisma.user.count({
    where: {
      role: "ADMIN",
    },
  })

  const editorUsers = await prisma.user.count({
    where: {
      role: "EDITOR",
    },
  })

  const regularUsers = await prisma.user.count({
    where: {
      role: "USER",
    },
  })

  // Taux d'engagement basé sur les utilisateurs actifs
  const engagementRate =
    totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0

  return {
    totalUsers,
    newUsersThisMonth,
    activeUsers,
    adminUsers,
    editorUsers,
    regularUsers,
    monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    engagementRate,
  }
}

export async function getUsersChartData() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Récupérer les users des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: ninetyDaysAgo,
      },
    },
    select: {
      createdAt: true,
      role: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // Grouper les users par date
  const chartData: {
    [key: string]: { users: number }
  } = {}

  // Initialiser les 90 derniers jours avec des valeurs 0
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    chartData[dateKey] = { users: 0 }
  }

  // Compter les users par jour
  users.forEach((user) => {
    const dateKey = user.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].users++
    }
  })

  // Convertir en format tableau pour le graphique
  return Object.entries(chartData).map(([date, data]) => ({
    date,
    users: data.users,
  }))
}
