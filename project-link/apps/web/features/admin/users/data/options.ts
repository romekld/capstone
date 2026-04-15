import { Shield, ShieldCheck, ShieldX } from 'lucide-react';
import type { UserRole, UserStatus } from './schema'

export const roleOptions: { label: string; value: UserRole }[] = [
  { label: 'Barangay Health Worker (BHW)', value: 'bhw' },
  { label: 'Rural Health Midwife (RHM)', value: 'midwife_rhm' },
  { label: 'Public Health Nurse (PHN)', value: 'nurse_phn' },
  { label: 'PHIS Coordinator', value: 'phis_coordinator' },
  { label: 'City Health Officer', value: 'city_health_officer' },
  { label: 'System Admin', value: 'system_admin' },
]

export const statusOptions: { label: string; value: UserStatus; icon: React.ReactNode }[] = [
  { label: 'Active', value: 'active', icon : ShieldCheck },
  { label: 'Inactive', value: 'inactive', icon : Shield },
  { label: 'Invited', value: 'invited', icon : Shield },
  { label: 'Suspended', value: 'suspended', icon : ShieldX },
]

export const passwordStateOptions = [
  { label: 'Change pending', value: 'change_pending' },
  { label: 'Updated', value: 'updated' },
] as const
