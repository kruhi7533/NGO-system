/**
 * Email delivery — provider-agnostic.
 *
 * Provider selection (first match wins):
 *   1. RESEND_API_KEY  → Resend (HTTPS REST API, no SDK dependency)
 *   2. SMTP_HOST       → Nodemailer SMTP transport
 *   3. neither         → DEV fallback: logs the email to the console
 *
 * This mirrors the rate limiter's graceful-degradation pattern so the app
 * runs locally with zero email credentials while still working in production.
 */
import nodemailer from 'nodemailer'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || 'Imparency <noreply@imparency.org>'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

type Provider = 'resend' | 'smtp' | 'console'

const provider: Provider = RESEND_API_KEY ? 'resend' : SMTP_HOST ? 'smtp' : 'console'

// Lazily-created singleton SMTP transport
let smtpTransport: nodemailer.Transporter | null = null
function getSmtpTransport(): nodemailer.Transporter {
  if (!smtpTransport) {
    smtpTransport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = implicit TLS, 587 = STARTTLS
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
  }
  return smtpTransport
}

let warnedConsole = false

export interface SendEmailInput {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Sends an email via the configured provider.
 * Never throws to the caller for transport-level issues in the console fallback;
 * Resend/SMTP errors propagate so signup can roll back the orphan user.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailInput): Promise<void> {
  if (provider === 'resend') {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html, text }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      throw new Error(`Resend send failed (${res.status}): ${detail}`)
    }
    return
  }

  if (provider === 'smtp') {
    await getSmtpTransport().sendMail({ from: EMAIL_FROM, to, subject, html, text })
    return
  }

  // console fallback (dev)
  if (!warnedConsole) {
    console.warn(
      '[email] No RESEND_API_KEY or SMTP_HOST set — emails are logged to the console only (dev mode).'
    )
    warnedConsole = true
  }
  console.log(`\n[DEV EMAIL] → ${to}\n  Subject: ${subject}\n  ${text || stripHtml(html)}\n`)
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

// ─── Templates ──────────────────────────────────────────────────────────────

function layout(heading: string, body: string, cta?: { label: string; url: string }): string {
  return `<!doctype html><html><body style="margin:0;background:#f1f5f9;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 16px;">
    <div style="background:#ffffff;border-radius:16px;padding:32px;border:1px solid #e2e8f0;">
      <h1 style="font-size:18px;color:#0f172a;margin:0 0 12px;">${heading}</h1>
      <div style="font-size:14px;color:#475569;line-height:1.6;">${body}</div>
      ${
        cta
          ? `<a href="${cta.url}" style="display:inline-block;margin-top:20px;background:#059669;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 20px;border-radius:10px;">${cta.label}</a>
             <p style="font-size:11px;color:#94a3b8;margin-top:16px;word-break:break-all;">Or paste this link: ${cta.url}</p>`
          : ''
      }
    </div>
    <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:16px;">Imparency · Transparency for trusted giving</p>
  </div></body></html>`
}

export async function sendVerificationEmail(to: string, url: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Verify your Imparency email',
    html: layout(
      'Confirm your email',
      'Welcome to Imparency. Confirm your email address to activate your account.',
      { label: 'Verify Email', url }
    ),
    text: `Verify your Imparency email: ${url}`,
  })
}

export async function sendPasswordResetEmail(to: string, url: string): Promise<void> {
  await sendEmail({
    to,
    subject: 'Reset your Imparency password',
    html: layout(
      'Reset your password',
      'We received a request to reset your password. This link expires in 1 hour. If you did not request this, you can ignore this email.',
      { label: 'Reset Password', url }
    ),
    text: `Reset your Imparency password: ${url}`,
  })
}
