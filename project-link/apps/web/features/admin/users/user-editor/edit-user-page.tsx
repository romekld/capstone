"use client"

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { UserForm } from './components/user-form'
import { buildDefaultFormValues, type AddUserValues } from '../data/form-schema'
import { createMockUsers } from '../data/users'

type EditUserPageProps = {
  userId: string
}

export function EditUserPage({ userId }: EditUserPageProps) {
  const user = createMockUsers(38).find((item) => item.id === userId)

  if (!user) {
    return (
      <section className='flex flex-col gap-4 sm:gap-6'>
        <Alert variant='destructive'>
          <AlertCircle />
          <AlertTitle>We couldn&apos;t find that user</AlertTitle>
          <AlertDescription>
            The selected account is not available in the current local dataset.
          </AlertDescription>
        </Alert>
        <div>
          <Button asChild variant='outline'>
            <Link href='/admin/users'>Back to users</Link>
          </Button>
        </div>
      </section>
    )
  }

  function handleSubmit(values: AddUserValues) {
    // Placeholder for edge-function integration.
    console.log('Update user payload', values)
  }

  const now = new Date().toISOString()

  return (
    <section className='flex min-h-0 flex-1 flex-col'>
      <UserForm
        mode='edit'
        seed={109}
        defaultValues={buildDefaultFormValues({
          seed: 109,
          user,
        })}
        activity={{
          createdAt: now,
          updatedAt: now,
          lastLoginAt: user.lastLoginAt,
          passwordChangedAt: user.passwordState === 'updated' ? now : null,
        }}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
