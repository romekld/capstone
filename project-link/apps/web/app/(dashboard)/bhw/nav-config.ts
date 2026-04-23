import { House } from "lucide-react"

import type { SidebarSection } from "@/features/navigation/data/types"

export const bhwNavSections = [
  {
    id: "bhw-main",
    label: "Overview",
    items: [
      {
        id: "bhw-dashboard",
        title: "Home",
        href: "/bhw/dashboard",
        icon: House,
        match: ["/bhw/dashboard"],
      },
    ],
  },
] satisfies SidebarSection[]
