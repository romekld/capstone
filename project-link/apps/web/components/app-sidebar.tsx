"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UsersIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  ClipboardCheckIcon,
  Building2Icon,
} from "lucide-react"

const roleLabelByKey = {
  admin: "Admin",
  bhw: "BHW",
  phn: "PHN",
  rhm: "RHM",
  phis: "PHIS",
  cho: "CHO",
} as const

const roleNav = {
  admin: [
    { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboardIcon },
    { title: "Users", url: "/admin/users", icon: UsersIcon },
  ],
  bhw: [{ title: "Dashboard", url: "/bhw/dashboard", icon: HeartPulseIcon }],
  phn: [{ title: "Dashboard", url: "/phn/dashboard", icon: StethoscopeIcon }],
  rhm: [{ title: "Dashboard", url: "/rhm/dashboard", icon: ClipboardCheckIcon }],
  phis: [{ title: "Dashboard", url: "/phis/dashboard", icon: Building2Icon }],
  cho: [{ title: "Dashboard", url: "/cho/dashboard", icon: Building2Icon }],
} as const

type RoleKey = keyof typeof roleNav

function resolveRole(pathname: string): RoleKey {
  const key = pathname.split("/").filter(Boolean)[0] as RoleKey | undefined
  if (key && key in roleNav) {
    return key
  }
  return "admin"
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const role = resolveRole(pathname)
  const navItems = roleNav[role]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{roleLabelByKey[role]} Navigation</SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url || pathname.startsWith(`${item.url}/`)}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: "System Admin",
            email: "cho2@projectlink.ph",
            avatar: "/favicon.ico",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
