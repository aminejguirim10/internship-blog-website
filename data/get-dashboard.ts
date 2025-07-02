import { checkAdmin, checkEditor } from "@/lib/auth"
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

export async function getEditorDashboardMetrics(authorId: string) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }

  // Date de début du mois
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  // Total blogs ce mois-ci pour cet éditeur
  const totalBlogsThisMonth = await prisma.blog.count({
    where: {
      authorId,
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  // Blogs acceptés pour cet éditeur
  const blogsAccepted = await prisma.blog.count({
    where: {
      authorId,
      status: "ACCEPTED",
    },
  })

  // Blogs en attente pour cet éditeur
  const blogsPending = await prisma.blog.count({
    where: {
      authorId,
      status: "PENDING",
    },
  })

  // Vues ce mois-ci pour tous les blogs de cet éditeur
  const viewsThisMonth = await prisma.blogView.count({
    where: {
      blog: {
        authorId,
      },
      createdAt: {
        gte: startOfMonth,
      },
    },
  })

  return {
    totalBlogsThisMonth,
    blogsAccepted,
    blogsPending,
    viewsThisMonth,
  }
}

export async function getEditorDashboardChartData(authorId: string) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }

  // Récupérer les données des 90 derniers jours
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  // Blogs de cet éditeur
  const blogs = await prisma.blog.findMany({
    where: {
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

  // Vues des blogs de cet éditeur
  const blogViews = await prisma.blogView.findMany({
    where: {
      blog: {
        authorId,
      },
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

  // Commentaires sur les blogs de cet éditeur
  const comments = await prisma.comment.findMany({
    where: {
      blog: {
        authorId,
      },
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
      accepted: number
      pending: number
      views: number
      comments: number
    }
  } = {}

  // Initialiser les 90 derniers jours avec des valeurs 0
  for (let i = 89; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split("T")[0]
    chartData[dateKey] = {
      blogs: 0,
      accepted: 0,
      pending: 0,
      views: 0,
      comments: 0,
    }
  }

  // Compter les blogs par jour
  blogs.forEach((blog) => {
    const dateKey = blog.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].blogs++
      if (blog.status === "ACCEPTED") {
        chartData[dateKey].accepted++
      } else if (blog.status === "PENDING") {
        chartData[dateKey].pending++
      }
    }
  })

  // Compter les vues par jour
  blogViews.forEach((view) => {
    const dateKey = view.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].views++
    }
  })

  // Compter les commentaires par jour
  comments.forEach((comment) => {
    const dateKey = comment.createdAt.toISOString().split("T")[0]
    if (chartData[dateKey]) {
      chartData[dateKey].comments++
    }
  })

  // Convertir en format tableau pour le graphique
  return Object.entries(chartData).map(([date, data]) => ({
    date,
    blogs: data.blogs,
    accepted: data.accepted,
    pending: data.pending,
    views: data.views,
    comments: data.comments,
  }))
}
