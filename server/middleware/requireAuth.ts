import type { MiddlewareHandler } from 'hono'
import { auth, prisma } from '../auth'
import type { Role } from '@prisma/client'

declare module 'hono' {
  interface ContextVariableMap {
    userId: string
    userRole: Role
    ngoStatus: string | null
  }
}

/**
 * Backend authorization middleware.
 * Validates session, role, and for NGO routes: approval status.
 *
 * Frontend ProtectedRoute is UX only. This is the real security boundary.
 */
export function requireAuth(allowedRoles?: Role[]): MiddlewareHandler {
  return async (c, next) => {
    // 1. Validate session
    const session = await auth.api.getSession({ headers: c.req.raw.headers })

    if (!session?.user) {
      return c.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
        401
      )
    }

    // 2. Fetch profile (role + lockout status)
    const profile = await prisma.profile.findUnique({
      where: { id: session.user.id },
      include: { ngoRegistration: { select: { status: true } } },
    })

    if (!profile) {
      return c.json(
        { success: false, error: { code: 'PROFILE_NOT_FOUND', message: 'User profile not found.' } },
        401
      )
    }

    // 3. Session hijacking — user-agent binding
    const currentUA = c.req.header('user-agent') || ''
    const sessionMeta = session.session as { userAgent?: string; token?: string }
    if (sessionMeta?.userAgent && sessionMeta.userAgent !== currentUA) {
      // Invalidate session and log anomaly
      if (sessionMeta.token) {
        await auth.api.revokeSession({
          body: { token: sessionMeta.token },
          headers: c.req.raw.headers,
        })
      }
      await prisma.auditLog.create({
        data: {
          userId: profile.id,
          action: 'SESSION_ANOMALY',
          ipAddress: c.req.header('x-forwarded-for')?.split(',')[0] || null,
          metadata: { reason: 'user-agent mismatch' },
        },
      })
      return c.json(
        { success: false, error: { code: 'SESSION_INVALID', message: 'Session invalidated. Please sign in again.' } },
        401
      )
    }

    // 4. Role check
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
      return c.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions.' } },
        403
      )
    }

    // 5. NGO approval check — NGO users must be VERIFIED to access NGO endpoints
    if (profile.role === 'NGO' && allowedRoles?.includes('NGO')) {
      const ngoStatus = profile.ngoRegistration?.status
      if (ngoStatus !== 'VERIFIED') {
        return c.json(
          {
            success: false,
            error: {
              code: 'NGO_PENDING',
              message: 'Your NGO registration is pending admin approval.',
              status: ngoStatus,
            },
          },
          403
        )
      }
    }

    // Pass context to route handlers
    c.set('userId', profile.id)
    c.set('userRole', profile.role)
    c.set('ngoStatus', profile.ngoRegistration?.status ?? null)

    await next()
  }
}
