import { createAuthClient } from 'better-auth/react'
import type { UserProfile, ApiResponse } from '../types/auth'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Better Auth browser client — handles signUp, signIn, signOut, useSession
export const authClient = createAuthClient({
  baseURL: API_BASE,
})


// ─── Profile helpers ──────────────────────────────────────────────────────────

/**
 * Fetches the authenticated user's profile (role, ngoStatus) from the server.
 * Call this after signIn to get the role for routing.
 */
export async function fetchProfile(): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      credentials: 'include',
    })
    if (!res.ok) return null
    const json: ApiResponse<UserProfile> = await res.json()
    return json.success ? (json.data ?? null) : null
  } catch {
    return null
  }
}

/**
 * Full donor signup — creates the auth user + Profile(DONOR) atomically, entirely
 * server-side. No prior session is needed (email verification is required, so no
 * session exists at signup time). Orphan cleanup is handled on the server.
 */
export async function createDonorProfile(payload: {
  email: string
  password: string
  displayName?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json: ApiResponse<UserProfile> = await res.json()
    return { success: json.success, error: json.error?.message }
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

/**
 * Full NGO signup — creates the auth user + Profile(NGO) + NgoRegistration atomically,
 * entirely server-side. No prior session is needed (email verification is required,
 * so no session exists at signup time). Orphan cleanup is handled on the server.
 */
export async function createNgoRegistration(payload: {
  email: string
  password: string
  orgName: string
  registrationNumber?: string
  phone?: string
  website?: string
  state?: string
  city?: string
  category?: string
  mission?: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/ngo-registration`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const json: ApiResponse<unknown> = await res.json()
    return { success: json.success, error: json.error?.message }
  } catch {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

/**
 * Reports a failed login attempt to the server for brute-force tracking.
 */
export async function reportLoginFailure(email: string): Promise<{ locked: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/auth-hooks/login-failed`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return await res.json()
  } catch {
    return { locked: false }
  }
}

/**
 * Reports a successful login to reset lockout counters and write audit log.
 */
export async function reportLoginSuccess(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/auth-hooks/login-success`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Non-critical — don't throw
  }
}

/**
 * Checks if an account is locked before showing an error.
 * Returns locked=true/false — does not reveal whether the email exists.
 */
export async function checkLockout(email: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE}/api/auth-hooks/lockout-check?email=${encodeURIComponent(email)}`,
      { credentials: 'include' }
    )
    const json = await res.json()
    return json.locked === true
  } catch {
    return false
  }
}

/**
 * Writes logout audit log before signing out.
 */
export async function signOutWithAudit(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/auth-hooks/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Non-critical
  }
  await authClient.signOut()
}

// Route map for role-based navigation after login
export const roleToPath: Record<string, string> = {
  DONOR: '/donor',
  NGO: '/ngo',
  ADMIN: '/admin',
}
