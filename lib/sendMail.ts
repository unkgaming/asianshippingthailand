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
  if (!to) return; // no destination configured

  // Prefer Resend if API key present
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    try {
      await resend.emails.send({
        from: from || defaultFrom,
        to: Array.isArray(to) ? to : [to],
        subject,
        text,
        html,
      });
      return;
    } catch {
      // fall through to SMTP
    }
  }

  // Fallback to SMTP (e.g., Gmail with App Password)
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return;

  const transporter = nodemailer.createTransport({
    host,
    port: port || 587,
    secure: port === 465, // true for 465, false for others
    auth: { user, pass },
  });

  await transporter.sendMail({ from: from || defaultFrom, to, subject, text, html });
}
