export type Blog = {
  id: string
  title: string
  content: string
  categoryId: string
  status: string
  image: string
  createdAt: Date
  tags: { id: string; name: string }[]
  author: { name: string }
  viewsCount: number
}
