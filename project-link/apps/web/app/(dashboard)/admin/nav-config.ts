import {
  Building2Icon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  MapIcon,
  MapPinnedIcon,
  UsersIcon,
} from "lucide-react"

import type { SidebarSection } from "@/features/navigation/data/types"

export const adminNavSections = [
  {
    id: "admin-main",
    label: "Admin Navigation",
    items: [
      {
        id: "admin-dashboard",
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboardIcon,
        match: ["/admin/dashboard"],
      },
      {
        id: "admin-users",
        title: "Users",
        href: "/admin/users",
        icon: UsersIcon,
        match: ["/admin/users", "/admin/users/*"],
      },
      {
        id: "admin-health-stations",
        title: "Health Stations",
        icon: Building2Icon,
        match: ["/admin/health-stations", "/admin/health-stations/*"],
        children: [
          {
            id: "admin-health-stations-city-barangays",
            title: "City Barangays",
            href: "/admin/health-stations/city-barangays",
            icon: MapIcon,
            match: ["/admin/health-stations/city-barangays"],
          },
          {
            id: "admin-health-stations-coverage-planner",
            title: "Coverage Planner",
            href: "/admin/health-stations/coverage-planner",
            icon: MapIcon,
            match: ["/admin/health-stations/coverage-planner"],
          },
          {
            id: "admin-health-stations-manage-bhs",
            title: "Manage BHS",
            href: "/admin/health-stations/manage",
            icon: MapPinnedIcon,
            match: ["/admin/health-stations/manage"],
          },
          {
            id: "admin-health-stations-assignments",
            title: "Station Assignments",
            href: "/admin/health-stations/assignments",
            icon: ClipboardListIcon,
            match: ["/admin/health-stations/assignments"],
          },
        ],
      },
    ],
  },
] satisfies SidebarSection[]
