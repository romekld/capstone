"use client"

import Link from 'next/link'
import { useState } from 'react'
import { UserRoundPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import type { AdminUser } from './data/schema'
import { createMockUsers } from './data/users'
import { UsersStats } from './components/users-stats'
import { UsersTable } from './components/users-table'

export function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>(() => createMockUsers(38))

    function handleResetPasswords(userIds: string[]) {
        const ids = new Set(userIds)

        setUsers((current) =>
            current.map((user) =>
                ids.has(user.id) ? { ...user, passwordState: 'change_pending' } : user
            )
        )
    }

    function handleSetStatus(userIds: string[], nextStatus: 'active' | 'inactive') {
        const ids = new Set(userIds)

        setUsers((current) =>
            current.map((user) =>
                ids.has(user.id) ? { ...user, status: nextStatus } : user
            )
        )
    }

    return (
        <section className='flex flex-col gap-4 sm:gap-6'>
            <PageHeader
                title='User List'
                description='Manage users and their roles and assignments here.'
                controls={
                    <Button asChild className='h-10 px-4'>
                        <Link href='/admin/users/new'>
                            Add User
                            <UserRoundPlus data-icon='inline-end' />
                        </Link>
                    </Button>
                }
            />

            <UsersStats users={users} />

            <UsersTable
                data={users}
                onResetPasswords={handleResetPasswords}
                onSetStatus={handleSetStatus}
            />
        </section>
    )
}