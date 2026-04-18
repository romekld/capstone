export type UserStatus = 'active' | 'inactive' | 'invited' | 'suspended'

export type UserRole =
  | 'bhw'
  | 'rhm'
  | 'phn'
  | 'phis'
  | 'cho'
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
  healthStationId: string | null
  mustChangePassword: boolean
  lastLoginAt: string | null
}
