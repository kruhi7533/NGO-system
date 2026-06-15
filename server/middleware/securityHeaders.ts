import type { MiddlewareHandler } from 'hono'

/**
 * Applies security headers to every response.
 * Must be mounted first on the Hono app.
 */
export const securityHeaders: MiddlewareHandler = async (c, next) => {
  await next()

  c.header('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline'; " +  // unsafe-inline needed for Vite HMR in dev
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "frame-ancestors 'none';"
  )
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  c.header('X-XSS-Protection', '1; mode=block')
}
