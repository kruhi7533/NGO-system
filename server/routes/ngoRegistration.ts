import { Hono } from 'hono'
import { prisma, auth } from '../auth'
import { rateLimit } from '../middleware/rateLimit'

const ngoRouter = new Hono()

interface NgoPayload {
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

/**
 * POST /api/ngo-registration
 * Full NGO signup. Performed entirely server-side so it works even though
 * email verification is required (no client session exists yet at signup).
 *
 * 1. Creates the Better Auth user via auth.api.signUpEmail (sends verification email)
 * 2. Atomically creates: Profile (role=NGO) + NgoRegistration (status=PENDING) + AuditLog
 * 3. On any failure after the user is created, the auth user is deleted (no orphan)
 *
 * Returns a generic message on failure to avoid email enumeration.
 */
ngoRouter.post('/', rateLimit('signup'), async (c) => {
  const body = await c.req.json<NgoPayload>()
  const ip = c.req.header('x-forwarded-for')?.split(',')[0] || null
  const ua = c.req.header('user-agent') || null

  const email = body.email?.trim().toLowerCase()
  if (!email || !body.password || !body.orgName) {
    return c.json(
      { success: false, error: { code: 'INVALID_INPUT', message: 'Missing required fields.' } },
      400
    )
  }

  let userId: string | null = null

  try {
    // 1. Create Better Auth user (server-side — no session needed)
    //    callbackURL: after the user clicks the verification link (handled on
    //    the API server), Better Auth redirects here — must point at the client
    //    (port 5173), otherwise it lands on the API server's root and 404s.
    const clientURL = process.env.VITE_CLIENT_URL || 'http://localhost:5173'
    const signUpRes = await auth.api.signUpEmail({
      body: {
        email,
        password: body.password,
        name: body.orgName,
        callbackURL: `${clientURL}/login?verified=1`,
      },
    })

    if (!signUpRes?.user) {
      // Generic — never confirm whether the email already exists
      return c.json({ success: true, data: { pending: true } }, 200)
    }

    userId = signUpRes.user.id

    // 2. Atomic: Profile(NGO) + NgoRegistration(PENDING) + AuditLog
    const result = await prisma.$transaction(async (tx) => {
      const profile = await tx.profile.create({
        data: { id: userId!, email, role: 'NGO', displayName: body.orgName },
      })

      const ngoReg = await tx.ngoRegistration.create({
        data: {
          userId: profile.id,
          orgName: body.orgName,
          registrationNumber: body.registrationNumber || null,
          phone: body.phone || null,
          website: body.website || null,
          state: body.state || null,
          city: body.city || null,
          category: body.category || null,
          mission: body.mission || null,
          status: 'PENDING',
        },
      })

      await tx.auditLog.create({
        data: {
          userId: profile.id,
          action: 'NGO_SUBMITTED',
          ipAddress: ip,
          metadata: { userAgent: ua, orgName: body.orgName },
        },
      })

      return { profile, ngoReg }
    })

    return c.json({ success: true, data: result }, 201)
  } catch (err) {
    // Roll back orphan auth user if the transaction failed after user creation
    if (userId) {
      try {
        await prisma.user.delete({ where: { id: userId } })
      } catch {
        // best-effort cleanup; nightly job catches stragglers
      }
    }
    // Generic message — avoid email enumeration / leaking DB errors
    return c.json(
      { success: false, error: { code: 'SIGNUP_FAILED', message: 'Registration could not be completed. Please try again.' } },
      400
    )
  }
})

export default ngoRouter
