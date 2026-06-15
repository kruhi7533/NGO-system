import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/auth'

interface ProtectedRouteProps {
  allowedRoles: UserRole[]
}

/**
 * ProtectedRoute — frontend UX guard only.
 * Real security is enforced server-side in server/middleware/requireAuth.ts.
 *
 * Flow:
 *   loading       → spinner (don't redirect until we know)
 *   no session    → /login
 *   unverified    → /verify-email
 *   NGO pending   → /pending-approval
 *   wrong role    → /  (home)
 *   correct role  → <Outlet />
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, role, ngoStatus, emailVerified, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // No session — redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Email not verified — prompt to verify
  if (!emailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  // Wrong role — send home
  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  // NGO role accessing NGO routes — must be VERIFIED
  if (role === 'NGO' && allowedRoles.includes('NGO') && ngoStatus !== 'VERIFIED') {
    return <Navigate to="/pending-approval" replace />
  }

  return <Outlet />
}
