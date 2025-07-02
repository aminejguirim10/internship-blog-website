"use client"

import * as React from "react"

import { NavDocuments } from "@/components/layout/nav-documents"
import { NavMain } from "@/components/layout/nav-main"
import { NavUser } from "@/components/layout/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { data } from "@/constants"
import { User } from "@prisma/client"
import { Icons } from "@/components/shared/icons"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  editor: User
}

export function AppSidebar({ editor, ...props }: AppSidebarProps) {
  //TODO: Hope to fixe the sidebar bug
  return (
    <Sidebar collapsible="offcanvas" {...props} className="bg-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <div className="flex w-fit items-center justify-center">
                  <Image
                    src="/assets/logonav.png"
                    alt="Logo"
                    width={467}
                    height={498}
                    className="size-8"
                  />
                </div>
                <span className="text-lg font-semibold text-white">معهدي</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            <SidebarMenuItem className="text-white">
              <SidebarMenuButton asChild>
                <Link href={"/dashboard"}>
                  <Icons.layoutDashboard />
                  <span>لوحة القيادة</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {editor.role === "ADMIN" && <NavMain items={data.navMain} />}
        <NavDocuments items={data.documents} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={editor as any} />
      </SidebarFooter>
    </Sidebar>
  )
}
