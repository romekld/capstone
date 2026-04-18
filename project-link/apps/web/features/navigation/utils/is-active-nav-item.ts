import type { SidebarItem } from "../data/types"

function matchesPattern(pathname: string, pattern: string) {
  if (pattern.endsWith("/*")) {
    const prefix = pattern.slice(0, -2)

    return pathname === prefix || pathname.startsWith(`${prefix}/`)
  }

  return pathname === pattern
}

export function isActiveNavItem(pathname: string, item: SidebarItem) {
  const patterns = item.match ?? (item.href ? [item.href, `${item.href}/*`] : [])

  return (
    patterns.some((pattern) => matchesPattern(pathname, pattern)) ||
    Boolean(item.children?.some((child) => isActiveNavItem(pathname, child)))
  )
}
