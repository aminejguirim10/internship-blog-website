import { prisma } from "@/lib/db"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)
    const eventType = evt.type
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, image_url } = evt.data
      const newUser = await prisma.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0]?.email_address,
          name: first_name,
          image: image_url || "",
        },
      })
    }

    return new Response("Webhook received", { status: 200 })
  } catch (err) {
    return new Response("Error verifying webhook", { status: 400 })
  }
}
