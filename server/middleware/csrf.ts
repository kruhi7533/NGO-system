import type { MiddlewareHandler } from 'hono'

const ALLOWED_ORIGIN = process.env.VITE_CLIENT_URL || 'http://localhost:5173'

// Methods that mutate state — must have Origin validated
const MUTATION_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE'])

/**
 * CSRF protection middleware.
 * - Validates Origin header on all state-changing requests.
 * - Better Auth already sets SameSite=Strict on cookies.
 * - GET/HEAD/OPTIONS are safe methods — no check needed.
 */
export const csrf: MiddlewareHandler = async (c, next) => {
  if (!MUTATION_METHODS.has(c.req.method)) {
    await next()
    return
  }

  // Better Auth's own /api/auth/* routes handle their own CSRF via SameSite=Strict
  // We still validate Origin for our custom routes
  if (c.req.path.startsWith('/api/auth/')) {
    await next()
    return
  }

  const origin = c.req.header('origin') || c.req.header('referer')

  if (!origin || !origin.startsWith(ALLOWED_ORIGIN)) {
    return c.json(
      {
        success: false,
        error: { code: 'CSRF_REJECTED', message: 'Request origin not allowed.' },
      },
      403
    )
  }

  await next()
}
