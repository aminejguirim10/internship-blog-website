import { UsersTable } from "../dashboard/users-table"
import { getAllUsers } from "@/data/get-users"

export async function UsersTableAsync() {
  const users = await getAllUsers()
  return <UsersTable data={users} />
}
