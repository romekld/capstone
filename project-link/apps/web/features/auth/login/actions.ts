'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type LoginState =
  | { error: string }
  | null

const ROLE_HOME: Record<string, string> = {
  system_admin: '/admin/users',
  cho: '/dashboard',
  phis: '/dashboard',
  phn: '/dashboard',
  rhm: '/dashboard',
  bhw: '/bhw',
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    return { error: 'Invalid email or password.' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Could not retrieve session. Please try again.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, must_change_password')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return { error: 'Account profile not found. Contact your administrator.' }
  }

  redirect(ROLE_HOME[profile.role] ?? '/dashboard')
}
