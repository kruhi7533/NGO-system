/**
 * Seeds the three pre-verified demo accounts referenced by Login.tsx
 * "Reviewer Demo Access". Run with:
 *   npx tsx --env-file=.env prisma/seed.ts
 *
 * Idempotent: re-running skips accounts that already have a Profile.
 * These accounts are created email-verified so they can sign in immediately,
 * bypassing the (mandatory) email-verification step that real signups require.
 */
import { auth, prisma } from '../server/auth'
import type { Role } from '@prisma/client'

const PASSWORD = 'Demo@1234!'

interface DemoAccount {
  email: string
  name: string
  role: Role
  ngo?: { orgName: string; city: string; state: string; category: string; mission: string }
}

const accounts: DemoAccount[] = [
  { email: 'donor@demo.imparency.org', name: 'Demo Donor', role: 'DONOR' },
  {
    email: 'ngo@demo.imparency.org',
    name: 'Demo NGO',
    role: 'NGO',
    ngo: {
      orgName: 'Demo NGO Foundation',
      city: 'Pune',
      state: 'Maharashtra',
      category: 'Education',
      mission: 'A pre-verified demonstration NGO account used to showcase the donor-facing transparency, campaign, and proof-upload workflows during reviews.',
    },
  },
  { email: 'admin@demo.imparency.org', name: 'Demo Admin', role: 'ADMIN' },
]

async function seedAccount(acc: DemoAccount) {
  const existing = await prisma.profile.findUnique({ where: { email: acc.email } })
  if (existing) {
    console.log(`✓ ${acc.email} already exists (${existing.role}) — skipped`)
    return
  }

  // Create the auth user (hashes the password into the Account table)
  let userId: string
  try {
    const res = await auth.api.signUpEmail({
      body: { email: acc.email, password: PASSWORD, name: acc.name },
    })
    userId = res.user.id
  } catch (err) {
    // If the auth user exists but Profile doesn't, recover its id
    const u = await prisma.user.findUnique({ where: { email: acc.email } })
    if (!u) throw err
    userId = u.id
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { emailVerified: true } })

    await tx.profile.create({
      data: { id: userId, email: acc.email, role: acc.role, displayName: acc.name },
    })

    if (acc.ngo) {
      await tx.ngoRegistration.create({
        data: {
          userId,
          orgName: acc.ngo.orgName,
          city: acc.ngo.city,
          state: acc.ngo.state,
          category: acc.ngo.category,
          mission: acc.ngo.mission,
          status: 'VERIFIED',
          reviewedAt: new Date(),
        },
      })
    }

    await tx.auditLog.create({
      data: { userId, action: 'SIGNUP', metadata: { seed: true } },
    })
  })

  console.log(`✓ Created ${acc.email} (${acc.role})${acc.ngo ? ' + VERIFIED NgoRegistration' : ''}`)
}

async function main() {
  console.log('Seeding demo accounts...\n')
  for (const acc of accounts) {
    await seedAccount(acc)
  }
  console.log('\nDone. Sign in via "Reviewer Demo Access" with password:', PASSWORD)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
