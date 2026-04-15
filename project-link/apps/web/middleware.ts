import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'
import type { Database } from '@/lib/supabase/database.types'

type UserRole = Database['public']['Enums']['user_role']

const ROLE_HOME: Record<UserRole, string> = {
  system_admin: '/admin/dashboard',
  cho:          '/cho/dashboard',
  bhw:          '/bhw/dashboard',
  rhm:          '/rhm/dashboard',
  phn:          '/phn/dashboard',
  phis:         '/phis/dashboard',
}

// Routes restricted to a specific role
const ROLE_PREFIXES: Array<{ prefix: string; role: UserRole }> = [
  { prefix: '/admin', role: 'system_admin' },
  { prefix: '/cho',   role: 'cho' },
  { prefix: '/bhw',   role: 'bhw' },
  { prefix: '/rhm',   role: 'rhm' },
  { prefix: '/phn',   role: 'phn' },
  { prefix: '/phis',  role: 'phis' },
]

const PUBLIC_PATHS = ['/login', '/forgot-password']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createClient(request, response)

  // Always refresh the session
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public paths: redirect to role home if already logged in
  if (PUBLIC_PATHS.includes(pathname)) {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile) {
        await supabase.auth.signOut()
        return NextResponse.redirect(new URL('/login', request.url))
      }

      return NextResponse.redirect(new URL(ROLE_HOME[profile.role], request.url))
    }
    return response
  }

  // All other paths require a session
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Fetch profile for role checks
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/change-password') {
    return NextResponse.redirect(new URL(ROLE_HOME[profile.role], request.url))
  }

  // Role-based route access
  const restricted = ROLE_PREFIXES.find(({ prefix }) => pathname.startsWith(prefix))
  if (restricted && restricted.role !== profile.role) {
    return NextResponse.redirect(new URL(ROLE_HOME[profile.role], request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
