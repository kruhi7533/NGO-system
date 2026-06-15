// ─── Auth types shared across the frontend ────────────────────────────────────

export type UserRole = 'DONOR' | 'NGO' | 'ADMIN'

export type NgoStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  emailVerified: boolean
  image?: string | null
}

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  displayName: string | null
  avatarUrl: string | null
  ngoRegistration?: {
    status: NgoStatus
    orgName: string
  } | null
}

export interface SignUpDonorPayload {
  email: string
  password: string
  displayName: string
}

export interface SignUpNgoPayload {
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
}

// API response wrapper — matches server response shape
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    status?: string
  }
}
