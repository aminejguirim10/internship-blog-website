import { BlogType } from "@prisma/client"

export type Blog = {
  id: string
  title: string
  content: string
  type: BlogType
  status: string
  image: string | null
  createdAt: Date
  tags: { id: string; name: string }[]
  author: { name: string }
  viewsCount: number
}
