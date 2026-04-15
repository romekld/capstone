import { EditUserPage } from '@/features/admin/users/user-editor'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  return <EditUserPage userId={id} />
}
