import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MustChangePasswordDialog } from "@/features/auth/change-password"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let mustChangePassword = false

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("must_change_password")
      .eq("id", user.id)
      .maybeSingle()

    mustChangePassword = Boolean(profile?.must_change_password)
  }

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar variant="inset" />
      <SidebarInset className="min-h-0 overflow-hidden">
        <DashboardHeader />
        <main
          data-dashboard-scroll
          className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6"
        >
          {children}
        </main>
      </SidebarInset>
      <MustChangePasswordDialog initialOpen={mustChangePassword} />
    </SidebarProvider>
  )
}
