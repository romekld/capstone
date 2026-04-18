import { createClient } from '@/lib/supabase/server'
import type { AdminUser } from './data/schema'

function mapRow(row: {
  id: string
  user_id: string
  first_name: string
  middle_name: string | null
  last_name: string
  username: string
  email: string
  mobile_number: string | null
  address_line_1: string | null
  address_line_2: string | null
  city_municipality: string | null
  province: string | null
  status: AdminUser['status']
  role: AdminUser['role']
  health_station_id: string | null
  must_change_password: boolean
  last_login_at: string | null
  health_stations: { name: string } | null
}): AdminUser {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    middleName: row.middle_name ?? undefined,
    lastName: row.last_name,
    username: row.username,
    email: row.email,
    mobileNumber: row.mobile_number ?? '',
    addressLine1: row.address_line_1 ?? undefined,
    addressLine2: row.address_line_2 ?? undefined,
    cityMunicipality: row.city_municipality ?? undefined,
    province: row.province ?? undefined,
    status: row.status,
    role: row.role,
    healthStationName: row.health_stations?.name ?? null,
    healthStationId: row.health_station_id,
    mustChangePassword: row.must_change_password,
    lastLoginAt: row.last_login_at,
  }
}

const PROFILE_SELECT = `
  id,
  user_id,
  first_name,
  middle_name,
  last_name,
  username,
  email,
  mobile_number,
  address_line_1,
  address_line_2,
  city_municipality,
  province,
  status,
  role,
  health_station_id,
  must_change_password,
  last_login_at,
  health_stations ( name )
` as const

export async function getUsers(): Promise<AdminUser[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row) =>
    mapRow(row as Parameters<typeof mapRow>[0])
  )
}

export async function getUser(id: string): Promise<AdminUser | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', id)
    .single()

  if (error || !data) return null

  return mapRow(data as Parameters<typeof mapRow>[0])
}

export async function getNextUserSeed(): Promise<number> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  return (count ?? 0) + 1
}

export async function getHealthStations() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('health_stations')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name')

  if (error) throw error

  return data ?? []
}
