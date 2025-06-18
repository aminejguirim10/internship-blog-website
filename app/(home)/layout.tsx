import Footer from "@/components/layout/footer"
import Navbar from "@/components/layout/navbar"

export default function HomeLayout({
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
