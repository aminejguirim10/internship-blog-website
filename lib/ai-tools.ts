import { z } from "zod"
import { prisma } from "@/lib/db"
import { generateAISummary } from "@/lib/ai-utils"
import { tool } from "ai"

export const tools = {
  getBlogByTitle: tool({
    description:
      "البحث المكثف عن مقال بناءً على العنوان أو المحتوى مع الأولوية للمطابقة الدقيقة",
    inputSchema: z.object({
      title: z.string().describe("عنوان المقال أو كلمة مفتاحية للبحث عنه"),
    }),
    execute: async ({ title }) => {
      try {
        let blog = await prisma.blog.findFirst({
          where: {
            title: {
              equals: title,
              mode: "insensitive",
            },
            status: "ACCEPTED",
          },
          include: {
            author: {
              select: {
                name: true,
                image: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            tags: true,
            _count: {
              select: {
                comments: true,
                blogViews: true,
              },
            },
          },
        })

        if (!blog) {
          blog = await prisma.blog.findFirst({
            where: {
              OR: [
                {
                  title: {
                    contains: title,
                    mode: "insensitive",
                  },
                },
                {
                  content: {
                    contains: title,
                    mode: "insensitive",
                  },
                },
              ],
              status: "ACCEPTED",
            },
            include: {
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
              category: {
                select: {
                  name: true,
                },
              },
              tags: true,
              _count: {
                select: {
                  comments: true,
                  blogViews: true,
                },
              },
            },
          })
        }

        if (!blog) {
          return "لم يتم العثور على أي مقال بهذا العنوان أو المحتوى"
        }

        const aiSummary = await generateAISummary(blog.content, "blog")

        return {
          id: blog.id,
          title: blog.title,
          content: aiSummary,
          author: blog.author?.name || "غير معروف",
          category: blog.category?.name || "غير مصنف",
          tags: blog.tags.map((tag) => tag.name),
          commentsCount: blog._count.comments,
          viewsCount: blog._count.blogViews,
          createdAt: blog.createdAt.toLocaleDateString("fr-FR"),
          url: `/blogs/${blog.id}`,
        }
      } catch (error) {
        return "حدث خطأ أثناء البحث عن المقال"
      }
    },
  }),

  searchBlogsByContent: tool({
    description: "البحث في محتوى المقالات بناءً على عبارات أو كلمات مفتاحية",
    inputSchema: z.object({
      phrase: z
        .string()
        .describe("العبارة أو الكلمة المفتاحية للبحث في المحتوى"),
      limit: z
        .number()
        .optional()
        .describe("عدد النتائج المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ phrase, limit = 5 }) => {
      try {
        const blogs = await prisma.blog.findMany({
          where: {
            OR: [
              {
                content: {
                  contains: phrase,
                  mode: "insensitive",
                },
              },
              {
                title: {
                  contains: phrase,
                  mode: "insensitive",
                },
              },
            ],
            status: "ACCEPTED",
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            _count: {
              select: {
                comments: true,
                blogViews: true,
              },
            },
          },
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        })

        if (blogs.length === 0) {
          return "لم يتم العثور على أي مقالات تحتوي على هذه العبارة"
        }

        const blogsWithSummaries = await Promise.all(
          blogs.map(async (blog) => {
            const aiSummary = await generateAISummary(blog.content, "blog")
            return {
              id: blog.id,
              title: blog.title,
              summary: aiSummary,
              author: blog.author?.name || "غير معروف",
              category: blog.category?.name || "غير مصنف",
              commentsCount: blog._count.comments,
              viewsCount: blog._count.blogViews,
              createdAt: blog.createdAt.toLocaleDateString("fr-FR"),
              url: `/blogs/${blog.id}`,
            }
          })
        )

        return blogsWithSummaries
      } catch (error) {
        return "حدث خطأ أثناء البحث في المقالات"
      }
    },
  }),

  getBlogsByTags: tool({
    description: "البحث عن المقالات بناءً على العلامات (Tags)",
    inputSchema: z.object({
      tagName: z.string().describe("اسم العلامة للبحث عنها"),
      limit: z
        .number()
        .optional()
        .describe("عدد النتائج المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ tagName, limit = 5 }) => {
      try {
        const blogs = await prisma.blog.findMany({
          where: {
            tags: {
              some: {
                name: {
                  contains: tagName,
                  mode: "insensitive",
                },
              },
            },
            status: "ACCEPTED",
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            tags: true,
            _count: {
              select: {
                comments: true,
                blogViews: true,
              },
            },
          },
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        })

        if (blogs.length === 0) {
          return "لم يتم العثور على أي مقالات بهذه العلامة"
        }

        const blogsWithSummaries = await Promise.all(
          blogs.map(async (blog) => {
            const aiSummary = await generateAISummary(blog.content, "blog")
            return {
              id: blog.id,
              title: blog.title,
              summary: aiSummary,
              author: blog.author?.name || "غير معروف",
              category: blog.category?.name || "غير مصنف",
              tags: blog.tags.map((tag) => tag.name),
              commentsCount: blog._count.comments,
              viewsCount: blog._count.blogViews,
              createdAt: blog.createdAt.toLocaleDateString("fr-FR"),
              url: `/blogs/${blog.id}`,
            }
          })
        )

        return blogsWithSummaries
      } catch (error) {
        return "حدث خطأ أثناء البحث عن المقالات بالعلامات"
      }
    },
  }),

  getLatestBlogs: tool({
    description: "الحصول على أحدث المقالات المنشورة",
    inputSchema: z.object({
      limit: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => {
          if (typeof val === "string") {
            const parsed = parseInt(val, 10)
            return isNaN(parsed) ? 5 : parsed
          }
          return val || 5
        })
        .describe("عدد المقالات المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ limit = 5 }) => {
      try {
        const blogs = await prisma.blog.findMany({
          where: {
            status: "ACCEPTED",
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            tags: true,
            _count: {
              select: {
                comments: true,
                blogViews: true,
              },
            },
          },
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        })

        const blogsWithSummaries = await Promise.all(
          blogs.map(async (blog) => {
            const aiSummary = await generateAISummary(blog.content, "blog")
            return {
              id: blog.id,
              title: blog.title,
              summary: aiSummary,
              author: blog.author?.name || "غير معروف",
              category: blog.category?.name || "غير مصنف",
              tags: blog.tags.map((tag) => tag.name),
              commentsCount: blog._count.comments,
              viewsCount: blog._count.blogViews,
              createdAt: blog.createdAt.toLocaleDateString("fr-FR"),
              url: `/blogs/${blog.id}`,
            }
          })
        )

        return blogsWithSummaries
      } catch (error) {
        return "حدث خطأ أثناء جلب أحدث المقالات"
      }
    },
  }),

  getBlogSummary: tool({
    description:
      "الحصول على ملخص ذكي مقال بناءً على اسمه باستخدام الذكاء الاصطناعي مع أولوية للمطابقة الدقيقة",
    inputSchema: z.object({
      blogName: z.string().describe("اسم أو عنوان المقال للحصول على ملخصه"),
    }),
    execute: async ({ blogName }) => {
      try {
        let blog = await prisma.blog.findFirst({
          where: {
            title: {
              equals: blogName,
              mode: "insensitive",
            },
            status: "ACCEPTED",
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            tags: true,
          },
        })

        if (!blog) {
          blog = await prisma.blog.findFirst({
            where: {
              OR: [
                {
                  title: {
                    contains: blogName,
                    mode: "insensitive",
                  },
                },
                {
                  content: {
                    contains: blogName,
                    mode: "insensitive",
                  },
                },
              ],
              status: "ACCEPTED",
            },
            include: {
              author: {
                select: {
                  name: true,
                },
              },
              category: {
                select: {
                  name: true,
                },
              },
              tags: true,
            },
          })
        }

        if (!blog) {
          return "لم يتم العثور على المقال المطلوب"
        }

        const aiSummary = await generateAISummary(blog.content, "blog")

        return {
          title: blog.title,
          summary: aiSummary,
          author: blog.author?.name || "غير معروف",
          category: blog.category?.name || "غير مصنف",
          tags: blog.tags.map((tag) => tag.name),
          publishedDate: blog.createdAt.toLocaleDateString("fr-FR"),
          url: `/blogs/${blog.id}`,
        }
      } catch (error) {
        return "حدث خطأ أثناء جلب ملخص المقال"
      }
    },
  }),

  getEventByTitle: tool({
    description:
      "البحث المكثف عن حدث بناءً على العنوان أو المحتوى مع أولوية للمطابقة الدقيقة",
    inputSchema: z.object({
      title: z.string().describe("عنوان الحدث أو كلمة مفتاحية للبحث عنه"),
    }),
    execute: async ({ title }) => {
      try {
        let event = await prisma.event.findFirst({
          where: {
            title: {
              equals: title,
              mode: "insensitive",
            },
          },
        })

        if (!event) {
          event = await prisma.event.findFirst({
            where: {
              OR: [
                {
                  title: {
                    contains: title,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: title,
                    mode: "insensitive",
                  },
                },
              ],
            },
          })
        }

        if (!event) {
          return "لم يتم العثور على أي حدث بهذا العنوان أو المحتوى"
        }

        const aiSummary = await generateAISummary(event.description, "event")

        const result = {
          id: event.id,
          title: event.title,
          description: aiSummary,
          date: event.date.toLocaleDateString("fr-FR"),
          hour: event.hour,
          link: event.link,
          image: event.image,
          url: `/events/${event.id}`,
        }

        return result
      } catch (error) {
        console.error("❌ [getEventByTitle] خطأ:", error)
        return "حدث خطأ أثناء البحث عن الحدث"
      }
    },
  }),

  getLatestEvents: tool({
    description: "الحصول على أحدث الأحداث",
    inputSchema: z.object({
      limit: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => {
          if (typeof val === "string") {
            const parsed = parseInt(val, 10)
            return isNaN(parsed) ? 5 : parsed
          }
          return val || 5
        })
        .describe("عدد الأحداث المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ limit = 5 }) => {
      try {
        const events = await prisma.event.findMany({
          take: limit,
          orderBy: {
            date: "desc",
          },
        })

        const eventsWithSummaries = await Promise.all(
          events.map(async (event, index) => {
            const aiSummary = await generateAISummary(
              event.description,
              "event"
            )

            const result = {
              id: event.id,
              title: event.title,
              description: aiSummary,
              date: event.date.toLocaleDateString("fr-FR"),
              hour: event.hour,
              link: event.link,
              url: `/events/${event.id}`,
            }

            return result
          })
        )

        return eventsWithSummaries
      } catch (error) {
        console.error("❌ [getLatestEvents] خطأ:", error)
        return "حدث خطأ أثناء جلب أحدث الأحداث"
      }
    },
  }),

  getEventSummary: tool({
    description:
      "الحصول على ملخص ذكي لحدث بناءً على اسمه باستخدام الذكاء الاصطناعي مع أولوية للمطابقة الدقيقة",
    inputSchema: z.object({
      eventName: z.string().describe("اسم الحدث للحصول على ملخصه"),
    }),
    execute: async ({ eventName }) => {
      try {
        let event = await prisma.event.findFirst({
          where: {
            title: {
              equals: eventName,
              mode: "insensitive",
            },
          },
        })

        if (!event) {
          event = await prisma.event.findFirst({
            where: {
              OR: [
                {
                  title: {
                    contains: eventName,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: eventName,
                    mode: "insensitive",
                  },
                },
              ],
            },
          })
        }

        if (!event) {
          return "لم يتم العثور على الحدث المطلوب"
        }

        const aiSummary = await generateAISummary(event.description, "event")

        return {
          title: event.title,
          summary: aiSummary,
          date: event.date.toLocaleDateString("fr-FR"),
          hour: event.hour,
          link: event.link,
          url: `/events/${event.id}`,
        }
      } catch (error) {
        return "حدث خطأ أثناء جلب ملخص الحدث"
      }
    },
  }),

  searchSimilarEvents: tool({
    description: "البحث عن الأحداث التي لها أسماء مشابهة",
    inputSchema: z.object({
      eventName: z.string().describe("اسم الحدث للبحث عن أحداث مشابهة"),
      limit: z
        .number()
        .optional()
        .describe("عدد النتائج المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ eventName, limit = 5 }) => {
      try {
        const events = await prisma.event.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: eventName,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: eventName,
                  mode: "insensitive",
                },
              },
            ],
          },
          take: limit,
          orderBy: {
            date: "desc",
          },
        })

        if (events.length === 0) {
          return "لم يتم العثور على أحداث مشابهة"
        }

        const eventsWithSummaries = await Promise.all(
          events.map(async (event, index) => {
            const aiSummary = await generateAISummary(
              event.description,
              "event"
            )

            const result = {
              id: event.id,
              title: event.title,
              description: aiSummary,
              date: event.date.toLocaleDateString("fr-FR"),
              hour: event.hour,
              link: event.link,
              url: `/events/${event.id}`,
            }

            return result
          })
        )

        return eventsWithSummaries
      } catch (error) {
        console.error("❌ [searchSimilarEvents] خطأ:", error)
        return "حدث خطأ أثناء البحث عن الأحداث المشابهة"
      }
    },
  }),

  getLatestBlogsByCategory: tool({
    description: "الحصول على أحدث المقالات حسب فئة معينة",
    inputSchema: z.object({
      categoryName: z.string().describe("اسم الفئة المطلوبة"),
      limit: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => {
          if (typeof val === "string") {
            const parsed = parseInt(val, 10)
            return isNaN(parsed) ? 5 : parsed
          }
          return val || 5
        })
        .describe("عدد المقالات المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ categoryName, limit = 5 }) => {
      try {
        const blogs = await prisma.blog.findMany({
          where: {
            status: "ACCEPTED",
            category: {
              name: {
                contains: categoryName,
                mode: "insensitive",
              },
            },
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            tags: true,
            _count: {
              select: {
                comments: true,
                blogViews: true,
              },
            },
          },
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
        })

        if (blogs.length === 0) {
          return `لا توجد مقالات في فئة "${categoryName}"`
        }

        const blogsWithSummaries = await Promise.all(
          blogs.map(async (blog) => {
            const aiSummary = await generateAISummary(blog.content, "blog")
            return {
              id: blog.id,
              title: blog.title,
              summary: aiSummary,
              author: blog.author?.name || "مؤلف غير معروف",
              category: blog.category?.name || "بدون فئة",
              tags: blog.tags.map((tag) => tag.name),
              commentsCount: blog._count.comments,
              viewsCount: blog._count.blogViews,
              createdAt: blog.createdAt.toLocaleDateString("fr-FR"),
              url: `/blogs/${blog.id}`,
            }
          })
        )

        return blogsWithSummaries
      } catch (error) {
        return `حدث خطأ أثناء البحث عن المقالات في فئة "${categoryName}"`
      }
    },
  }),

  getMostViewedBlogs: tool({
    description: "الحصول على المقالات الأكثر مشاهدة",
    inputSchema: z.object({
      limit: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => {
          if (typeof val === "string") {
            const parsed = parseInt(val, 10)
            return isNaN(parsed) ? 5 : parsed
          }
          return val || 5
        })
        .describe("عدد المقالات المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ limit = 5 }) => {
      try {
        const blogs = await prisma.blog.findMany({
          where: {
            status: "ACCEPTED",
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            tags: true,
            _count: {
              select: {
                comments: true,
                blogViews: true,
              },
            },
          },
          take: limit,
          orderBy: {
            blogViews: {
              _count: "desc",
            },
          },
        })

        if (blogs.length === 0) {
          return "لا توجد مقالات متاحة"
        }

        const blogsWithSummaries = await Promise.all(
          blogs.map(async (blog) => {
            const aiSummary = await generateAISummary(blog.content, "blog")
            return {
              id: blog.id,
              title: blog.title,
              summary: aiSummary,
              author: blog.author?.name || "مؤلف غير معروف",
              category: blog.category?.name || "بدون فئة",
              tags: blog.tags.map((tag) => tag.name),
              commentsCount: blog._count.comments,
              viewsCount: blog._count.blogViews,
              createdAt: blog.createdAt.toLocaleDateString("fr-FR"),
              url: `/blogs/${blog.id}`,
            }
          })
        )

        return blogsWithSummaries
      } catch (error) {
        return "حدث خطأ أثناء البحث عن المقالات الأكثر مشاهدة"
      }
    },
  }),

  getMostViewedBlogsByCategory: tool({
    description: "الحصول على المقالات الأكثر مشاهدة حسب فئة معينة",
    inputSchema: z.object({
      categoryName: z.string().describe("اسم الفئة المطلوبة"),
      limit: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => {
          if (typeof val === "string") {
            const parsed = parseInt(val, 10)
            return isNaN(parsed) ? 5 : parsed
          }
          return val || 5
        })
        .describe("عدد المقالات المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ categoryName, limit = 5 }) => {
      try {
        const blogs = await prisma.blog.findMany({
          where: {
            status: "ACCEPTED",
            category: {
              name: {
                contains: categoryName,
                mode: "insensitive",
              },
            },
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            tags: true,
            _count: {
              select: {
                comments: true,
                blogViews: true,
              },
            },
          },
          take: limit,
          orderBy: {
            blogViews: {
              _count: "desc",
            },
          },
        })

        if (blogs.length === 0) {
          return `لا توجد مقالات في فئة "${categoryName}"`
        }

        const blogsWithSummaries = await Promise.all(
          blogs.map(async (blog) => {
            const aiSummary = await generateAISummary(blog.content, "blog")
            return {
              id: blog.id,
              title: blog.title,
              summary: aiSummary,
              author: blog.author?.name || "مؤلف غير معروف",
              category: blog.category?.name || "بدون فئة",
              tags: blog.tags.map((tag) => tag.name),
              commentsCount: blog._count.comments,
              viewsCount: blog._count.blogViews,
              createdAt: blog.createdAt.toLocaleDateString("fr-FR"),
              url: `/blogs/${blog.id}`,
            }
          })
        )

        return blogsWithSummaries
      } catch (error) {
        return `حدث خطأ أثناء البحث عن المقالات الأكثر مشاهدة في فئة "${categoryName}"`
      }
    },
  }),

  getMostCommentedBlogs: tool({
    description: "الحصول على المقالات الأكثر تعليقاً",
    inputSchema: z.object({
      limit: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => {
          if (typeof val === "string") {
            const parsed = parseInt(val, 10)
            return isNaN(parsed) ? 5 : parsed
          }
          return val || 5
        })
        .describe("عدد المقالات المطلوبة (افتراضياً 5)"),
    }),
    execute: async ({ limit = 5 }) => {
      try {
        const blogs = await prisma.blog.findMany({
          where: {
            status: "ACCEPTED",
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
            tags: true,
            _count: {
              select: {
                comments: true,
                blogViews: true,
              },
            },
          },
          take: limit,
          orderBy: {
            comments: {
              _count: "desc",
            },
          },
        })

        if (blogs.length === 0) {
          return "لا توجد مقالات متاحة"
        }

        const blogsWithSummaries = await Promise.all(
          blogs.map(async (blog) => {
            const aiSummary = await generateAISummary(blog.content, "blog")
            return {
              id: blog.id,
              title: blog.title,
              summary: aiSummary,
              author: blog.author?.name || "مؤلف غير معروف",
              category: blog.category?.name || "بدون فئة",
              tags: blog.tags.map((tag) => tag.name),
              commentsCount: blog._count.comments,
              viewsCount: blog._count.blogViews,
              createdAt: blog.createdAt.toLocaleDateString("fr-FR"),
              url: `/blogs/${blog.id}`,
            }
          })
        )

        return blogsWithSummaries
      } catch (error) {
        return "حدث خطأ أثناء البحث عن المقالات الأكثر تعليقاً"
      }
    },
  }),
}
