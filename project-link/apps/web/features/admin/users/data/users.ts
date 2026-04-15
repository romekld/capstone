import type { AdminUser, UserRole, UserStatus } from './schema'

const firstNames = [
  'Aira',
  'Liam',
  'Mika',
  'Noel',
  'Rica',
  'Paolo',
  'Jessa',
  'Mark',
  'Ivy',
  'Carlo',
]

const lastNames = [
  'Santos',
  'Reyes',
  'Dela Cruz',
  'Garcia',
  'Torres',
  'Mendoza',
  'Navarro',
  'Flores',
  'Castillo',
  'Ramos',
]

const stations = [
  'BHS Paliparan III',
  'BHS Salawag',
  'BHS Sampaloc I',
  'BHS San Dionisio',
  'BHS Burol Main',
  null,
]

const roles: UserRole[] = [
  'bhw',
  'midwife_rhm',
  'nurse_phn',
  'dso',
  'phis_coordinator',
  'city_health_officer',
  'system_admin',
]

const statuses: UserStatus[] = ['active', 'inactive', 'invited', 'suspended']

function toSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, '.')
}

function shouldUseCityWide(role: UserRole) {
  return [
    'nurse_phn',
    'dso',
    'phis_coordinator',
    'city_health_officer',
    'system_admin',
  ].includes(role)
}

export function createMockUsers(count = 30): AdminUser[] {
  const now = Date.now()

  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[index % firstNames.length]
    const lastName = lastNames[(index * 3) % lastNames.length]
    const role = roles[index % roles.length]
    const status = statuses[index % statuses.length]
    const station = shouldUseCityWide(role)
      ? null
      : stations[index % (stations.length - 1)]

    return {
      id: `u-${index + 1}`,
      userId: `USR-2026-${String(index + 1).padStart(4, '0')}`,
      firstName,
      lastName,
      username: `${toSlug(firstName)}.${toSlug(lastName)}${index + 1}`,
      email: `${toSlug(firstName)}.${toSlug(lastName)}${index + 1}@cho2.gov.ph`,
      mobileNumber: `091${String(20000000 + index).slice(-8)}`,
      status,
      role,
      healthStationName: station,
      passwordState: index % 3 === 0 ? 'change_pending' : 'updated',
      lastLoginAt:
        status === 'invited'
          ? null
          : new Date(now - (index + 2) * 86400000).toISOString(),
    }
  })
}
