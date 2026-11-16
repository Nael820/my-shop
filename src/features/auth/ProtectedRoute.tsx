import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { session, booted, error } = useAuth()
  const location = useLocation()

  if (!booted) {
    return <p className="fetch-message" role="status">Vérification de la session…</p>
  }

  if (error) {
    return <p className="fetch-message error-message" role="alert">{error.message}</p>
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
