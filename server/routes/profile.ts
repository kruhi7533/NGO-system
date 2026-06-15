import { Hono } from 'hono'
import { prisma, auth } from '../auth'
import { requireAuth } from '../middleware/requireAuth'
import { rateLimit } from '../middleware/rateLimit'

const profileRouter = new Hono()

/**
 * GET /api/profile
 * Returns the authenticated user's profile (role, ngoStatus).
 * Used by the frontend useAuth hook to get role after signIn.
 */
profileRouter.get('/', requireAuth(), async (c) => {
  const userId = c.get('userId')

  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      displayName: true,
      avatarUrl: true,
      ngoRegistration: {
        select: { status: true, orgName: true },
      },
    },
  })

  return c.json({ success: true, data: profile })
})

/**
 * POST /api/profile
 * Full donor signup. Performed entirely server-side so it works even though
 * email verification is required (no client session exists yet at signup).
 *
 * 1. Creates the Better Auth user via auth.api.signUpEmail (sends verification email)
 * 2. Atomically creates: Profile (role=DONOR) + AuditLog
 * 3. On any failure after the user is created, the auth user is deleted (no orphan)
 *
 * Returns a generic message on failure to avoid email enumeration.
 */
profileRouter.post('/', rateLimit('signup'), async (c) => {
  const body = await c.req.json<{ email?: string; password?: string; displayName?: string }>()
  const email = body.email?.trim().toLowerCase()
  const displayName = body.displayName?.trim()

  if (!email || !body.password) {
    return c.json(
      { success: false, error: { code: 'INVALID_INPUT', message: 'Missing required fields.' } },
      400
    )
  }

  if (!displayName || displayName.length < 2 || displayName.length > 100) {
    return c.json(
      { success: false, error: { code: 'INVALID_INPUT', message: 'Name must be 2–100 characters.' } },
      400
    )
  }

  const ip = c.req.header('x-forwarded-for')?.split(',')[0] || null
  const ua = c.req.header('user-agent') || null

  let userId: string | null = null

  try {
    // callbackURL: after the user clicks the verification link (handled on the
    // API server), Better Auth redirects here — must point at the client
    // (port 5173), otherwise it lands on the API server's root and 404s.
    const clientURL = process.env.VITE_CLIENT_URL || 'http://localhost:5173'
    const signUpRes = await auth.api.signUpEmail({
      body: {
        email,
        password: body.password,
        name: displayName,
        callbackURL: `${clientURL}/login?verified=1`,
      },
    })

    if (!signUpRes?.user) {
      // Generic — never confirm whether the email already exists
      return c.json({ success: true, data: { pending: true } }, 200)
    }

    userId = signUpRes.user.id

    const profile = await prisma.$transaction(async (tx) => {
      const p = await tx.profile.create({
        data: {
          id: userId!,
          email,
          role: 'DONOR',
          displayName: body.displayName || signUpRes.user.name || null,
        },
      })
      await tx.auditLog.create({
        data: {
          userId: p.id,
          action: 'SIGNUP',
          ipAddress: ip,
          metadata: { userAgent: ua, role: 'DONOR' },
        },
      })
      return p
    })

    return c.json({ success: true, data: profile }, 201)
  } catch (err) {
    if (userId) {
      try {
        await prisma.user.delete({ where: { id: userId } })
      } catch {
        // best-effort cleanup
      }
    }
    return c.json(
      { success: false, error: { code: 'SIGNUP_FAILED', message: 'Account could not be created. Please try again.' } },
      400
    )
  }
})

export default profileRouter
