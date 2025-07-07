import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID!
const authToken = process.env.TWILIO_AUTH_TOKEN!
const from = process.env.TWILIO_WHATSAPP_FROM!

const client = twilio(accountSid, authToken)

export async function sendWhatsAppMessage(to: string, body: string) {
  try {
    const message = await client.messages.create({
      from,
      to: `whatsapp:${to}`,
      body,
    })
  } catch (error) {
    return {
      message: "حدث خطأ أثناء إرسال رسالة WhatsApp",
      status: 500,
    }
  }
}
