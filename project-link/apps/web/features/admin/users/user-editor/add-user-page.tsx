"use client"

import { buildDefaultFormValues } from '../data/form-schema'
import type { AddUserValues } from '../data/form-schema'
import { UserForm } from './components/user-form'

export function AddUserPage() {
  function handleSubmit(values: AddUserValues) {
    // Placeholder for edge-function integration.
    console.log('Create user payload', values)
  }

  return (
    <section className='flex min-h-0 flex-1 flex-col'>
      <UserForm
        mode='create'
        seed={101}
        defaultValues={buildDefaultFormValues({ seed: 101 })}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
