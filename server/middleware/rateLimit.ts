import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { MiddlewareHandler } from 'hono'

const redisConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

// Only initialise Redis + limiters if credentials are present.
// Without them, rate limiting is skipped (acceptable for local dev).
let limiters: Record<string, Ratelimit> | null = null

if (redisConfigured) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  limiters = {
    signup: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 m'), prefix: 'rl:signup' }),
    login: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m'), prefix: 'rl:login' }),
    forgotPassword: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 m'), prefix: 'rl:forgot' }),
  }
} else {
  console.warn('[rate-limit] Upstash Redis not configured — rate limiting disabled. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env for production.')
}

type LimiterKey = 'signup' | 'login' | 'forgotPassword'

const RATE_LIMITED_RESPONSE = {
  success: false,
  error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
}

/**
 * Returns a Hono middleware that rate-limits by IP using the named limiter.
 * No-ops silently if Redis is not configured (local dev without Upstash).
 */
export function rateLimit(key: LimiterKey): MiddlewareHandler {
  return async (c, next) => {
    if (!limiters) {
      await next()
      return
    }

    const ip =
      c.req.header('x-forwarded-for')?.split(',')[0].trim() ||
      c.req.header('x-real-ip') ||
      '127.0.0.1'

    const { success } = await limiters[key].limit(ip)
    if (!success) return c.json(RATE_LIMITED_RESPONSE, 429)

    await next()
  }
}
