import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { arSA } from "@clerk/localizations"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import VercelAnalytics from "@/components/layout/vercel-analytics"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: {
    absolute: "معهدي",
    template: "معهدي | %s ",
  },
  description: "موقع يقدم تقارير، أبحاث، مقالات وفعاليات متنوعة .",
  metadataBase: new URL(`${process.env.NEXT_URL}`),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider localization={arSA}>
      <html lang="en" dir="rtl">
        <body className={`${poppins.variable} antialiased`}>
          {children}
          <Toaster />
          <VercelAnalytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
