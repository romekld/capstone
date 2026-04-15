export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'

export type UserPasswordState = 'change_pending' | 'updated'

export type UserRole =
  | 'bhw'
  | 'midwife_rhm'
  | 'nurse_phn'
  | 'dso'
  | 'phis_coordinator'
  | 'city_health_officer'
  | 'system_admin'

export type AdminUser = {
  id: string
  userId: string
  firstName: string
  middleName?: string
  lastName: string
  username: string
  email: string
  mobileNumber: string
  addressLine1?: string
  addressLine2?: string
  cityMunicipality?: string
  province?: string
  status: UserStatus
  role: UserRole
  healthStationName: string | null
  passwordState: UserPasswordState
  lastLoginAt: string | null
}
