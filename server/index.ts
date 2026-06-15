import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './auth'
import { securityHeaders } from './middleware/securityHeaders'
import { csrf } from './middleware/csrf'
import { rateLimit } from './middleware/rateLimit'
import profileRouter from './routes/profile'
import ngoRouter from './routes/ngoRegistration'
import authHooksRouter from './routes/authHooks'

const app = new Hono()

const CLIENT_URL = process.env.VITE_CLIENT_URL || 'http://localhost:5173'

// ─── Global middleware (order matters) ────────────────────────────────────────

// 1. Security headers on every response
app.use('*', securityHeaders)

// 2. CORS — only allow the Vite client origin
app.use(
  '*',
  cors({
    origin: CLIENT_URL,
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    maxAge: 600,
  })
)

// 3. CSRF protection on mutation routes (skips /api/auth/* which Better Auth handles)
app.use('*', csrf)

// 4. Rate limiting on auth sub-paths
app.use('/api/auth/sign-up/*', rateLimit('signup'))
app.use('/api/auth/sign-in/*', rateLimit('login'))
app.use('/api/auth/forget-password', rateLimit('forgotPassword'))

// 5. Better Auth — intercept everything under /api/auth via middleware
//    Using app.use + path check is more reliable than wildcard route matching
app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/api/auth/') || c.req.path === '/api/auth') {
    return auth.handler(c.req.raw)
  }
  await next()
})

// ─── Custom API routes ────────────────────────────────────────────────────────

app.route('/api/profile', profileRouter)
app.route('/api/ngo-registration', ngoRouter)
app.route('/api/auth-hooks', authHooksRouter)

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// ─── Start server ─────────────────────────────────────────────────────────────

const PORT = Number(process.env.API_PORT) || 3001

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`API server running at http://localhost:${PORT}`)
})

export default app
