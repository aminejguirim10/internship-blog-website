import { checkUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getApplications(pageSize = 10) {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  const applications = await prisma.application.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize,
  })

  return applications
}

export async function getAllApplications() {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  const applications = await prisma.application.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return applications
}

export async function getApplication(id: string) {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  const application = await prisma.application.findUnique({
    where: {
      id,
    },
  })

  if (!application) return null

  return application
}

export async function getApplicationsMetrics() {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  // Total applications actuellement en attente (dans la DB)
  const totalApplications = await prisma.application.count()

  // Applications ce mois-ci
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const newApplicationsThisMonth = await prisma.application.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Applications le mois dernier pour calculer la croissance
  const startOfLastMonth = new Date()
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)
  startOfLastMonth.setDate(1)
  startOfLastMonth.setHours(0, 0, 0, 0)

  const endOfLastMonth = new Date()
  endOfLastMonth.setDate(0)
  endOfLastMonth.setHours(23, 59, 59, 999)

  const lastMonthApplications = await prisma.application.count({
    where: {
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  })

  // Calcul de la croissance mensuelle
  const monthlyGrowth =
    lastMonthApplications > 0
      ? ((newApplicationsThisMonth - lastMonthApplications) /
          lastMonthApplications) *
        100
      : newApplicationsThisMonth > 0
        ? 100
        : 0

  // Applications récentes (derniers 7 jours)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentApplications = await prisma.application.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  })

  // Applications anciennes (plus de 7 jours sans traitement)
  const oldApplications = await prisma.application.count({
    where: {
      createdAt: {
        lt: sevenDaysAgo,
      },
    },
  })

  // Temps de réponse moyen basé sur l'âge des applications
  const applications = await prisma.application.findMany({
    select: {
      createdAt: true,
    },
    take: 100,
    orderBy: {
      createdAt: "desc",
    },
  })

  let totalAge = 0
  applications.forEach((app) => {
    const age = new Date().getTime() - app.createdAt.getTime()
    totalAge += age
  })

  const averageAge =
    applications.length > 0
      ? Math.round(totalAge / applications.length / (1000 * 60 * 60 * 24))
      : 0

  // Taux de traitement basé sur la vitesse de traitement (simulation)
  // Plus il y a d'applications anciennes, plus le taux est bas
  const processingRate =
    totalApplications > 0
      ? Math.max(20, 100 - (oldApplications / totalApplications) * 100)
      : 85

  return {
    totalApplications,
    newApplicationsThisMonth,
    pendingApplications: totalApplications, // Toutes sont en attente
    recentApplications,
    oldApplications,
    monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    averageAge: averageAge > 0 ? `${averageAge} days` : "< 1 day",
    processingRate: Math.round(processingRate * 100) / 100,
  }
}

export async function getApplicationsChartData() {
  const user = await checkUser()
  if (!user) {
    redirect("/sign-in")
  }

  // Récupérer les applications des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const applications = await prisma.application.findMany({
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

  // Grouper les applications par date
  const chartData: {
    [key: string]: { applications: number; pending: number }
  } = {}

  // Initialiser les 90 derniers jours avec des valeurs 0
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    chartData[dateKey] = { applications: 0, pending: 0 }
  }

  // Compter les applications par jour
  applications.forEach((app) => {
    const dateKey = app.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].applications++
      chartData[dateKey].pending++ // Toutes sont en attente
    }
  })

  // Convertir en format tableau pour le graphique
  return Object.entries(chartData).map(([date, data]) => ({
    date,
    applications: data.applications,
    pending: data.pending,
  }))
}
