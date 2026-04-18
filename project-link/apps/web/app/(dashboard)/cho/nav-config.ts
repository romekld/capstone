import { Building2Icon } from "lucide-react"

import type { SidebarSection } from "@/features/navigation/data/types"

export const choNavSections = [
  {
    id: "cho-main",
    label: "CHO Navigation",
    items: [
      {
        id: "cho-dashboard",
        title: "Dashboard",
        href: "/cho/dashboard",
        icon: Building2Icon,
        match: ["/cho/dashboard"],
      },
    ],
  },
] satisfies SidebarSection[]
