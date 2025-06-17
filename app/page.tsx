import { Button } from "@/components/ui/button"
import { getUsers } from "@/data/get-users"
import { checkUser } from "@/lib/auth"

export default async function Home() {
  const user = await checkUser()

  return (
    <div className="ss flex min-h-screen flex-col items-center justify-center p-4">
      <Button>Click me</Button>
    </div>
  )
}
