import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { Icons } from "../shared/icons"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    id: string
  }[]
}) {
  return (
    <SidebarGroup className="flex-1 overflow-hidden text-white group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center gap-2 text-white">
        <Icons.newspaper />
        مدونات
      </SidebarGroupLabel>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full" dir="rtl">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link
                    href={`/dashboard/blogs/${item.id}`}
                    className="flex items-center gap-2"
                  >
                    <Icons.iconReport />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </div>
    </SidebarGroup>
  )
}
