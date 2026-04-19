"use client"

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  getCityMunicipalityOptionsByProvinceName,
  getProvinceOptions,
  isDasmarinasSelection,
} from '@/lib/location'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { roleOptions } from '../../data/options'
import {
  addUserSchema,
  buildDefaultFormValues,
  CITY_WIDE_ROLES,
  editUserSchema,
  healthStationOptions,
  normalizePhoneInput,
  suggestUsername,
  type AddUserValues,
} from '../../data/form-schema'
import { UserFormMainPanel } from './user-form-main-panel'
import { UserFormRightPanel } from './user-form-right-panel'

type UserFormMode = 'create' | 'edit'

type UserFormProps = {
  mode: UserFormMode
  seed: number
  defaultValues?: Partial<AddUserValues>
  activity?: {
    createdAt?: string
    updatedAt?: string
    lastLoginAt?: string | null
    passwordChangedAt?: string | null
  }
  onSubmit: (values: AddUserValues) => void
}

const roleAccessNotes: Record<string, string[]> = {
  bhw: [
    'Records community visits and household-level data.',
    'Keep the purok assignment up to date.',
  ],
  rhm: [
    'Reviews TCL records and oversees maternal workflows.',
    'A station assignment is required for this role.',
  ],
  phn: [
    'Coordinates reviews and escalations across stations.',
    'Usually set up as city-wide.',
  ],
  phis: [
    'Handles MCT consolidation, DQC, and exports.',
    'This role is city-wide and report-focused.',
  ],
  cho: [
    'Read-only access to city-wide dashboards and alerts.',
    'Used for oversight and decision-making.',
  ],
  system_admin: [
    'Manages account creation and platform settings.',
    'Should stay city-wide and tightly restricted.',
  ],
}

const SUFFIX_NONE_VALUE = '__none__'

function toDisplayDate(value?: string | null) {
  if (!value) return 'Not available'

  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseIsoDate(value?: string) {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map((entry) => Number(entry))
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

function toReadableDate(value?: string) {
  if (!value) return ''
  const parsed = parseIsoDate(value)
  if (!parsed) return ''

  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(parsed)
}

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'NA'
}

export function UserForm({
  mode,
  seed,
  defaultValues,
  activity,
  onSubmit,
}: UserFormProps) {
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState('')
  const [photoFileName, setPhotoFileName] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [isDobPickerOpen, setIsDobPickerOpen] = useState(false)
  const [isStationPickerOpen, setIsStationPickerOpen] = useState(false)
  const [showTempPassword, setShowTempPassword] = useState(false)
  const [usernameEdited, setUsernameEdited] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<AddUserValues>({
    resolver: zodResolver(mode === 'create' ? addUserSchema : editUserSchema) as never,
    defaultValues: {
      ...buildDefaultFormValues({ seed }),
      ...defaultValues,
    },
  })

  const {
    register,
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form

  const values = useWatch({
    control,
  })

  const firstName = values.firstName ?? ''
  const lastName = values.lastName ?? ''
  const role = values.role ?? 'bhw'
  const isActive = values.isActive ?? true
  const mustChangePassword = values.mustChangePassword ?? true
  const selectedProvince = values.province ?? ''
  const selectedCityMunicipality = values.cityMunicipality ?? ''
  const selectedStationLabel = healthStationOptions.find(
    (item) => item.value === values.healthStationId
  )?.label
  const provinceOptions = useMemo(() => getProvinceOptions(), [])
  const cityMunicipalityOptions = useMemo(
    () => getCityMunicipalityOptionsByProvinceName(selectedProvince),
    [selectedProvince]
  )
  const isDasmarinasMode = isDasmarinasSelection(selectedProvince, selectedCityMunicipality)
  const previousProvinceRef = useRef<string | undefined>(undefined)
  const previousDasmarinasModeRef = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (photoPreviewUrl) {
        URL.revokeObjectURL(photoPreviewUrl)
      }
    }
  }, [photoPreviewUrl])

  useEffect(() => {
    if (usernameEdited) return

    const suggested = suggestUsername(firstName, lastName)
    if (!suggested) return

    setValue('username', suggested, {
      shouldDirty: false,
      shouldValidate: true,
    })
  }, [firstName, lastName, setValue, usernameEdited])

  useEffect(() => {
    if (!CITY_WIDE_ROLES.includes(role)) {
      return
    }

    setValue('healthStationId', '', { shouldValidate: true })
    setValue('purokAssignment', '', { shouldValidate: true })
  }, [role, setValue])

  useEffect(() => {
    if (previousProvinceRef.current === undefined) {
      previousProvinceRef.current = selectedProvince
      return
    }

    if (previousProvinceRef.current !== selectedProvince) {
      setValue('cityMunicipality', '', { shouldDirty: true, shouldValidate: true })
      setValue('addressLine2', '', { shouldDirty: true, shouldValidate: true })
    }

    previousProvinceRef.current = selectedProvince
  }, [selectedProvince, setValue])

  useEffect(() => {
    if (previousDasmarinasModeRef.current === undefined) {
      previousDasmarinasModeRef.current = isDasmarinasMode
      return
    }

    if (previousDasmarinasModeRef.current !== isDasmarinasMode) {
      setValue('addressLine2', '', { shouldDirty: true, shouldValidate: true })
    }

    previousDasmarinasModeRef.current = isDasmarinasMode
  }, [isDasmarinasMode, setValue])

  const roleOption = roleOptions.find((item) => item.value === role)
  const roleNotes = roleAccessNotes[role] ?? []

  function handlePhoneChange(fieldName: 'mobileNumber' | 'alternateMobileNumber', raw: string) {
    setValue(fieldName, normalizePhoneInput(raw), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  function handleChoosePhoto() {
    photoInputRef.current?.click()
  }

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxBytes = 2 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      setPhotoError('Only JPG, PNG, or WEBP files are allowed.')
      event.target.value = ''
      return
    }

    if (file.size > maxBytes) {
      setPhotoError('Image must be 2 MB or smaller.')
      event.target.value = ''
      return
    }

    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl)
    }

    const localUrl = URL.createObjectURL(file)
    setPhotoError('')
    setPhotoFileName(file.name)
    setPhotoPreviewUrl(localUrl)
    setValue('profilePhotoPath', file.name, { shouldDirty: true })
  }

  function handleRemovePhoto() {
    if (photoPreviewUrl) {
      URL.revokeObjectURL(photoPreviewUrl)
    }

    setPhotoError('')
    setPhotoFileName('')
    setPhotoPreviewUrl('')
    setValue('profilePhotoPath', '', { shouldDirty: true })

    if (photoInputRef.current) {
      photoInputRef.current.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex min-h-0 flex-1 flex-col'>
      <section className='mx-auto flex h-full min-h-0 w-full max-w-[1000px] flex-1 flex-col overflow-hidden'>
        <div className='shrink-0 bg-background/95 pb-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:pb-6'>
          <PageHeader
            title={mode === 'create' ? 'Add User' : 'Edit User'}
            description={
              mode === 'create'
                ? 'Set up a staff account with the right role and access.'
                : 'Update profile details, permissions, and account status.'
            }
            controls={
              <>
                <Button asChild className='h-10 px-4' variant='outline'>
                  <Link href='/admin/users'>Cancel</Link>
                </Button>
                <Button
                  className='h-10 px-4'
                  onClick={() =>
                    reset({
                      ...buildDefaultFormValues({ seed }),
                      ...defaultValues,
                    })
                  }
                  type='button'
                  variant='outline'
                >
                  Reset
                </Button>
                <Button className='h-10 px-4' type='submit' disabled={isSubmitting}>
                  {mode === 'create' ? 'Create User' : 'Update User'}
                </Button>
              </>
            }
          />
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto'>
          <div className='flex flex-col gap-4 px-1 py-2 sm:gap-5 sm:pr-2'>
            <section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]'>
              <UserFormMainPanel
                mode={mode}
                control={control}
                errors={errors}
                register={register}
                values={values}
                role={role}
                isActive={isActive}
                showTempPassword={showTempPassword}
                setShowTempPassword={setShowTempPassword}
                isDobPickerOpen={isDobPickerOpen}
                setIsDobPickerOpen={setIsDobPickerOpen}
                isStationPickerOpen={isStationPickerOpen}
                setIsStationPickerOpen={setIsStationPickerOpen}
                selectedStationLabel={selectedStationLabel}
                onUsernameManualEdit={() => setUsernameEdited(true)}
                onPhoneChange={handlePhoneChange}
                toIsoDate={toIsoDate}
                parseIsoDate={parseIsoDate}
                toReadableDate={toReadableDate}
                suffixNoneValue={SUFFIX_NONE_VALUE}
                provinceOptions={provinceOptions.map((option) => option.label)}
                cityMunicipalityOptions={cityMunicipalityOptions.map((option) => option.label)}
                isDasmarinasMode={isDasmarinasMode}
              />

              <UserFormRightPanel
                values={values}
                roleOptionLabel={roleOption?.label}
                roleNotes={roleNotes}
                mustChangePassword={mustChangePassword}
                isActive={isActive}
                activity={activity}
                photoPreviewUrl={photoPreviewUrl}
                photoFileName={photoFileName}
                photoError={photoError}
                photoInputRef={photoInputRef}
                onChoosePhoto={handleChoosePhoto}
                onPhotoChange={handlePhotoChange}
                onRemovePhoto={handleRemovePhoto}
                toDisplayDate={toDisplayDate}
                getInitials={getInitials}
              />
            </section>
          </div>
        </div>
      </section>
    </form>
  )
}
