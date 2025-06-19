import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <Navbar type="home" />
      {children}
      <Footer />
    </div>
  )
}
