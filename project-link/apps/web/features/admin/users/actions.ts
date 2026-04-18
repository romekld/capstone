'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { AddUserValues, EditUserValues } from './data/form-schema'
import type { UserStatus } from './data/schema'

type ActionResult = { success: true } | { error: string }

async function resolveStationId(
  admin: ReturnType<typeof createAdminClient>,
  slug: string | undefined
): Promise<string | null> {
  if (!slug) return null

  const { data } = await admin
    .from('health_stations')
    .select('id')
    .eq('slug', slug)
    .single()

  return data?.id ?? null
}

export async function createUserAction(
  values: AddUserValues
): Promise<ActionResult> {
  const admin = createAdminClient()

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: values.email,
    password: values.initialPassword,
    email_confirm: true,
    user_metadata: { role: values.role },
  })

  if (authError) return { error: authError.message }

  const authUserId = authData.user.id
  const healthStationId = await resolveStationId(admin, values.healthStationId)

  const { error: profileError } = await admin.from('profiles').insert({
    id: authUserId,
    user_id: values.userId,
    email: values.email,
    first_name: values.firstName,
    middle_name: values.middleName || null,
    last_name: values.lastName,
    name_suffix: values.nameSuffix || null,
    date_of_birth: values.dateOfBirth || null,
    sex: values.sex,
    username: values.username,
    mobile_number: values.mobileNumber || null,
    alternate_mobile_number: values.alternateMobileNumber || null,
    address_line_1: values.addressLine1,
    address_line_2: values.addressLine2 || null,
    city_municipality: values.cityMunicipality,
    province: values.province,
    role: values.role,
    health_station_id: healthStationId,
    purok_assignment: values.purokAssignment || null,
    coverage_notes: values.coverageNotes || null,
    admin_notes: values.adminNotes || null,
    must_change_password: values.mustChangePassword,
    status: values.isActive ? 'active' : 'inactive',
    deactivation_reason: values.deactivationReason || null,
  })

  if (profileError) {
    await admin.auth.admin.deleteUser(authUserId)
    return { error: profileError.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateUserAction(
  id: string,
  values: EditUserValues
): Promise<ActionResult> {
  const admin = createAdminClient()
  const healthStationId = await resolveStationId(admin, values.healthStationId)

  const { error } = await admin
    .from('profiles')
    .update({
      user_id: values.userId,
      email: values.email,
      first_name: values.firstName,
      middle_name: values.middleName || null,
      last_name: values.lastName,
      name_suffix: values.nameSuffix || null,
      date_of_birth: values.dateOfBirth || null,
      sex: values.sex,
      username: values.username,
      mobile_number: values.mobileNumber || null,
      alternate_mobile_number: values.alternateMobileNumber || null,
      address_line_1: values.addressLine1,
      address_line_2: values.addressLine2 || null,
      city_municipality: values.cityMunicipality,
      province: values.province,
      role: values.role,
      health_station_id: healthStationId,
      purok_assignment: values.purokAssignment || null,
      coverage_notes: values.coverageNotes || null,
      admin_notes: values.adminNotes || null,
      must_change_password: values.mustChangePassword,
      status: values.isActive ? 'active' : 'inactive',
      deactivation_reason: values.deactivationReason || null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${id}/edit`)
  return { success: true }
}

export async function setUserStatusAction(
  ids: string[],
  status: UserStatus
): Promise<ActionResult> {
  const admin = createAdminClient()

  const { error } = await admin
    .from('profiles')
    .update({ status })
    .in('id', ids)

  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function resetPasswordsAction(
  ids: string[]
): Promise<ActionResult> {
  const admin = createAdminClient()

  const { error } = await admin
    .from('profiles')
    .update({ must_change_password: true })
    .in('id', ids)

  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}
