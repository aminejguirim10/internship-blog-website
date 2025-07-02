import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { checkEditor } from "@/lib/auth"
import { redirect } from "next/navigation"
export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const editor = await checkEditor()
  if (!editor) {
    redirect("/sign-in")
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" editor={editor} />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
