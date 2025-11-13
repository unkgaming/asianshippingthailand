import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export type SendMailInput = {
  from?: string;
  to?: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

const defaultTo = process.env.MAIL_TO;
const defaultFrom = process.env.MAIL_FROM || 'no-reply@asianshippingthai.com';

export async function sendMail({ from, to = defaultTo, subject, text, html }: SendMailInput) {
  if (!to) {
    console.log('[sendMail] No recipient configured');
    return; // no destination configured
  }

  console.log('[sendMail] Attempting to send email to:', to);
  console.log('[sendMail] Subject:', subject);

  // Prefer Resend if API key present
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    console.log('[sendMail] Trying Resend API...');
    const resend = new Resend(resendKey);
    try {
      await resend.emails.send({
        from: from || defaultFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        html,
      });
      console.log('[sendMail] ✅ Email sent via Resend');
      return;
    } catch (err) {
      console.log('[sendMail] ❌ Resend failed:', err);
      // fall through to SMTP
    }
  }

  // Fallback to SMTP (e.g., Gmail with App Password)
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log('[sendMail] ❌ SMTP not configured properly');
    console.log('[sendMail] SMTP_HOST:', host);
    console.log('[sendMail] SMTP_USER:', user);
    console.log('[sendMail] SMTP_PASS:', pass ? '***' : 'missing');
    return;
  }

  console.log('[sendMail] Trying SMTP (Gmail)...');
  const transporter = nodemailer.createTransport({
    host,
    port: port || 587,
    secure: port === 465, // true for 465, false for others
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({ from: from || defaultFrom, to, subject, text, html });
    console.log('[sendMail] ✅ Email sent via SMTP');
  } catch (err) {
    console.log('[sendMail] ❌ SMTP failed:', err);
    throw err;
  }
}
