import { checkAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getDashboardMetrics() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Date de début du mois
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Blogs ce mois-ci
  const blogsThisMonth = await prisma.blog.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Events ce mois-ci
  const eventsThisMonth = await prisma.event.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Applications ce mois-ci
  const applicationsThisMonth = await prisma.application.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Users ce mois-ci
  const usersThisMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  return {
    blogsThisMonth,
    eventsThisMonth,
    applicationsThisMonth,
    usersThisMonth,
  }
}

export async function getDashboardChartData() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Récupérer les données des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  // Blogs
  const blogs = await prisma.blog.findMany({
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

  // Events
  const events = await prisma.event.findMany({
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

  // Applications
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

  // Users
  const users = await prisma.user.findMany({
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

  // Grouper par date
  const chartData: {
    [key: string]: {
      blogs: number
      events: number
      applications: number
      users: number
    }
  } = {}

  // Initialiser les 90 derniers jours avec des valeurs 0
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    chartData[dateKey] = { blogs: 0, events: 0, applications: 0, users: 0 }
  }

  // Compter les blogs par jour
  blogs.forEach((blog) => {
    const dateKey = blog.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].blogs++
    }
  })

  // Compter les events par jour
  events.forEach((event) => {
    const dateKey = event.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].events++
    }
  })

  // Compter les applications par jour
  applications.forEach((application) => {
    const dateKey = application.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].applications++
    }
  })

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
    blogs: data.blogs,
    events: data.events,
    applications: data.applications,
    users: data.users,
  }))
}
