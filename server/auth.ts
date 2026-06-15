import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { sendVerificationEmail, sendPasswordResetEmail } from './email'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ adapter })

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail(user.email, url)
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false, // force explicit login after verification
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url)
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,   // 7 days absolute
    updateAge: 60 * 30,              // refresh session if used within 30 min idle window
    cookieCache: {
      enabled: true,
      maxAge: 60 * 30,
    },
  },

  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3001',

  trustedOrigins: [
    process.env.VITE_CLIENT_URL || 'http://localhost:5173',
  ],

  secret: process.env.BETTER_AUTH_SECRET,
})

export type Auth = typeof auth
