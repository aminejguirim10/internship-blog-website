import { prisma } from "@/lib/db"

export async function getCommentsByBlog(
  blogId: string,
  page = 1,
  pageSize = 10
) {
  const where = {
    blogId,
  }

  const totalCount = await prisma.comment.count({ where })

  const comments = await prisma.comment.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          clerkId: true,
        },
      },
    },
  })

  return {
    comments,
    totalCount,
    hasMore: page * pageSize < totalCount,
    nextPage: page * pageSize < totalCount ? page + 1 : null,
  }
}
