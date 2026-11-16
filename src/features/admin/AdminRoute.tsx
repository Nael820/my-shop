import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { useIsAdminQuery } from '@/features/admin/queries'

export function AdminRoute({ children }: PropsWithChildren) {
  const { session } = useAuth()
  const result = useIsAdminQuery(session?.user.id)

  if (result.isPending) {
    return <p className="fetch-message" role="status">Vérification des droits administrateur…</p>
  }
  if (result.error) {
    return <p className="fetch-message error-message" role="alert">{result.error.message}</p>
  }
  if (!result.data) {
    return <Navigate to="/" replace />
  }

  return children
}
