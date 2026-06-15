import { Hono } from 'hono'
import { prisma, auth } from '../auth'

/**
 * Custom auth event hooks that run alongside Better Auth's built-in routes.
 * These handle brute-force lockout tracking and audit logging for login events.
 */
const authHooksRouter = new Hono()

/**
 * POST /api/auth-hooks/login-failed
 * Called by the client after a failed signIn attempt.
 * Increments failedLoginAttempts and locks account after 5 failures.
 */
authHooksRouter.post('/login-failed', async (c) => {
  const { email } = await c.req.json<{ email: string }>()
  const ip = c.req.header('x-forwarded-for')?.split(',')[0] || null

  const profile = await prisma.profile.findUnique({ where: { email } })
  if (!profile) {
    // Always return 200 to prevent email enumeration
    return c.json({ success: true })
  }

  const attempts = profile.failedLoginAttempts + 1
  const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null

  await prisma.profile.update({
    where: { id: profile.id },
    data: { failedLoginAttempts: attempts, lockedUntil },
  })

  await prisma.auditLog.create({
    data: {
      userId: profile.id,
      action: 'LOGIN',
      ipAddress: ip,
      metadata: { success: false, attempt: attempts, locked: lockedUntil !== null },
    },
  })

  return c.json({ success: true, locked: lockedUntil !== null })
})

/**
 * POST /api/auth-hooks/login-success
 * Called by the client after a successful signIn.
 * Resets lockout counters, rotates session, logs audit entry.
 */
authHooksRouter.post('/login-success', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session?.user) return c.json({ success: true })

  const ip = c.req.header('x-forwarded-for')?.split(',')[0] || null
  const ua = c.req.header('user-agent') || null

  await prisma.profile.update({
    where: { id: session.user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  })

  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: 'LOGIN',
      ipAddress: ip,
      metadata: { success: true, userAgent: ua },
    },
  })

  return c.json({ success: true })
})

/**
 * POST /api/auth-hooks/logout
 * Called by the client on logout. Logs audit entry.
 */
authHooksRouter.post('/logout', async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  const ip = c.req.header('x-forwarded-for')?.split(',')[0] || null

  if (session?.user) {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'LOGOUT',
        ipAddress: ip,
      },
    })
  }

  return c.json({ success: true })
})

/**
 * GET /api/auth-hooks/lockout-check?email=...
 * Checks if an account is currently locked before attempting login.
 * Always returns generic response — does not confirm if email exists.
 */
authHooksRouter.get('/lockout-check', async (c) => {
  const email = c.req.query('email')
  if (!email) return c.json({ locked: false })

  const profile = await prisma.profile.findUnique({
    where: { email },
    select: { lockedUntil: true },
  })

  const now = new Date()
  const locked = profile?.lockedUntil ? profile.lockedUntil > now : false

  // Return generic message regardless of whether email exists
  return c.json({ locked })
})

export default authHooksRouter
