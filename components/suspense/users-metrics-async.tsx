import { UsersMetrics } from "../dashboard/users-metrics"
import { getUsersMetrics } from "@/data/get-users"

export async function UsersMetricsAsync() {
  const metrics = await getUsersMetrics()
  return <UsersMetrics metrics={metrics} />
}
