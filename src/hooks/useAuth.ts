import { useEffect, useState } from 'react'
import { authClient, fetchProfile } from '../lib/authClient'
import { useStore } from '../store/useStore'
import type { UserProfile, UserRole, NgoStatus } from '../types/auth'

interface UseAuthReturn {
  user: NonNullable<ReturnType<typeof authClient.useSession>['data']>['user'] | null
  profile: UserProfile | null
  role: UserRole | null
  ngoStatus: NgoStatus | null
  emailVerified: boolean
  loading: boolean
  signOut: () => Promise<void>
}

/**
 * useAuth — primary auth hook for the frontend.
 *
 * - Wraps Better Auth's useSession() for session state.
 * - Fetches the user's Profile from the server to get role + ngoStatus.
 * - Syncs role to Zustand store so existing components that read currentRole still work.
 * - Returns loading=true until both session and profile are resolved.
 */
export function useAuth(): UseAuthReturn {
  const { data: session, isPending } = authClient.useSession()
  const { setRole, logout: zustandLogout } = useStore()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (isPending) return

    if (!session?.user) {
      setProfile(null)
      setProfileLoading(false)
      return
    }

    let cancelled = false
    setProfileLoading(true)

    fetchProfile().then((p) => {
      if (cancelled) return
      setProfile(p)
      setProfileLoading(false)

      // Sync role to Zustand so existing components work without change
      if (p?.role) {
        setRole(p.role as Parameters<typeof setRole>[0])
      }
    })

    return () => { cancelled = true }
  }, [session?.user?.id, isPending, setRole])

  const handleSignOut = async () => {
    const { signOutWithAudit } = await import('../lib/authClient')
    await signOutWithAudit()
    setProfile(null)
    zustandLogout()
  }

  const loading = isPending || profileLoading

  return {
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    ngoStatus: profile?.ngoRegistration?.status ?? null,
    emailVerified: session?.user?.emailVerified ?? false,
    loading,
    signOut: handleSignOut,
  }
}
