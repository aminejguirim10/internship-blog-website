import { ApplicationsTable } from "@/components/dashboard/applications-table"
import { getAllApplications } from "@/data/get-applications"

export async function ApplicationsTableAsync() {
  const applications = await getAllApplications()
  return <ApplicationsTable data={applications} />
}
