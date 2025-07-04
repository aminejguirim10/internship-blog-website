import { getAllCategories } from "@/data/get-categories"
import { CategoriesTable } from "../dashboard/categories-table"

export async function CategoriesTableAsync() {
  const categories = await getAllCategories()

  return <CategoriesTable categories={categories} />
}
