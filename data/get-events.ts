import { checkAdmin, checkUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getEvents(pageSize = 4) {
  const events = await prisma.event.findMany({
    orderBy: {
      date: "desc",
    },
    take: pageSize,
  })
  return events
}

export async function getAllEvents() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  const events = await prisma.event.findMany({
    orderBy: {
      date: "desc",
    },
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

export async function getEventsMetrics() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Total events
  const totalEvents = await prisma.event.count()

  // Events ce mois-ci
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const newEventsThisMonth = await prisma.event.count({
    where: {
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Events le mois dernier pour calculer la croissance
  const startOfLastMonth = new Date()
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)
  startOfLastMonth.setDate(1)
  startOfLastMonth.setHours(0, 0, 0, 0)

  const endOfLastMonth = new Date()
  endOfLastMonth.setDate(0)
  endOfLastMonth.setHours(23, 59, 59, 999)

  const lastMonthEvents = await prisma.event.count({
    where: {
      createdAt: {
        gte: startOfLastMonth,
        lte: endOfLastMonth,
      },
    },
  })

  // Calcul de la croissance mensuelle
  const monthlyGrowth =
    lastMonthEvents > 0
      ? ((newEventsThisMonth - lastMonthEvents) / lastMonthEvents) * 100
      : newEventsThisMonth > 0
        ? 100
        : 0

  // Upcoming events (future events)
  const now = new Date()
  const upcomingEvents = await prisma.event.count({
    where: {
      date: {
        gte: now,
      },
    },
  })

  // Past events
  const pastEvents = await prisma.event.count({
    where: {
      date: {
        lt: now,
      },
    },
  })

  // Events this week
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date()
  endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()))
  endOfWeek.setHours(23, 59, 59, 999)

  const thisWeekEvents = await prisma.event.count({
    where: {
      date: {
        gte: startOfWeek,
        lte: endOfWeek,
      },
    },
  })

  // Average days until next event
  const upcomingEventsData = await prisma.event.findMany({
    where: {
      date: {
        gte: now,
      },
    },
    select: {
      date: true,
    },
    orderBy: {
      date: "asc",
    },
    take: 10,
  })

  let totalDaysUntil = 0
  upcomingEventsData.forEach((event) => {
    const daysUntil = Math.ceil(
      (event.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
    totalDaysUntil += daysUntil
  })

  const averageDaysUntilEvent =
    upcomingEventsData.length > 0
      ? Math.round(totalDaysUntil / upcomingEventsData.length)
      : 0

  // Completion rate (simulation based on past vs total events)
  const completionRate =
    totalEvents > 0 ? Math.round((pastEvents / totalEvents) * 100) : 0

  return {
    totalEvents: totalEvents,
    newEventsThisMonth: newEventsThisMonth,
    upcomingEvents: upcomingEvents,
    pastEvents: pastEvents,
    thisWeekEvents: thisWeekEvents,
    monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
    averageDaysUntilEvent:
      averageDaysUntilEvent > 0
        ? `${averageDaysUntilEvent} أيام`
        : "لا توجد فعاليات قادمة",
    completionRate: completionRate,
  }
}

export async function getEventsChartData() {
  const admin = await checkAdmin()
  if (!admin) {
    redirect("/sign-in")
  }

  // Récupérer les events des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const events = await prisma.event.findMany({
    where: {
      createdAt: {
        gte: ninetyDaysAgo,
      },
    },
    select: {
      createdAt: true,
      date: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  // Grouper les events par date de création
  const chartData: {
    [key: string]: { events: number }
  } = {}

  // Initialiser les 90 derniers jours avec des valeurs 0
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    chartData[dateKey] = { events: 0 }
  }

  const now = new Date()

  // Compter les events par jour
  events.forEach((event) => {
    const dateKey = event.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].events++
    }
  })

  // Convertir en format tableau pour le graphique
  return Object.entries(chartData).map(([date, data]) => ({
    date,
    events: data.events,
  }))
}

export const filterEvents = async (
  title: string | null,
  page = 1,
  pageSize = 10,
  date: Date | null
) => {
  const where: any = {}

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

    where.date = {
      gte: startOfDay,
      lte: endOfDay,
    }
  }

  const totalCount = await prisma.event.count({ where })

  const events = await prisma.event.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      date: "desc",
    },
  })

  return { events, totalCount }
}
