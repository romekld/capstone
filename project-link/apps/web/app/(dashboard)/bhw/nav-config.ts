import { HeartPulseIcon } from "lucide-react"

import type { SidebarSection } from "@/features/navigation/data/types"

export const bhwNavSections = [
  {
    id: "bhw-main",
    label: "BHW Navigation",
    items: [
      {
        id: "bhw-dashboard",
        title: "Dashboard",
        href: "/bhw/dashboard",
        icon: HeartPulseIcon,
        match: ["/bhw/dashboard"],
      },
    ],
  },
] satisfies SidebarSection[]
