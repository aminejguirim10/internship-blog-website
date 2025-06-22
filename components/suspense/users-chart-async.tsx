import { UsersChart } from "../dashboard/users-chart"
import { getUsersChartData } from "@/data/get-users"

export async function UsersChartAsync() {
  const users = await getUsersChartData()
  return <UsersChart data={users} />
}
