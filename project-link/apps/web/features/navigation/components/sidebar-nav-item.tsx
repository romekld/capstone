"use client"

import Link from "next/link"
import { ChevronRightIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { SidebarItem } from "../data/types"
import { isActiveNavItem } from "../utils/is-active-nav-item"

type SidebarNavItemProps = {
  item: SidebarItem
  pathname: string
}

export function SidebarNavItem({ item, pathname }: SidebarNavItemProps) {
  const isActive = isActiveNavItem(pathname, item)

  if (item.children?.length) {
    return (
      <Collapsible
        asChild
        defaultOpen={isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isActive} tooltip={item.title}>
              {item.icon ? <item.icon /> : null}
              <span>{item.title}</span>
              <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((child) => (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActiveNavItem(pathname, child)}
                  >
                    <Link href={child.href ?? "#"}>
                      {child.icon ? <child.icon /> : null}
                      <span>{child.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  if (!item.href) {
    return null
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
      >
        <Link href={item.href}>
          {item.icon ? <item.icon /> : null}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
