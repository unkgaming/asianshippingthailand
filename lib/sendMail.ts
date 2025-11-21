import nodemailer from 'nodemailer';

export type SendMailInput = {
  from?: string;
  replyTo?: string;
  to?: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

const defaultTo = process.env.MAIL_TO;
const defaultFrom = process.env.MAIL_FROM || 'no-reply@asianshippingthai.com';
const safeFrom = process.env.MAIL_FROM_SAFE || 'asian@asianshippingthai.com';
const companyDomain = process.env.COMPANY_EMAIL_DOMAIN || 'asianshippingthai.com';
const allowedFromDomains = (process.env.MAIL_FROM_ALLOWED || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export async function sendMail({ from, replyTo, to = defaultTo, subject, text, html }: SendMailInput) {
  if (!to) {
    console.log('[sendMail] No recipient configured');
    return; // no destination configured
  }

  const requestedFrom = (from || defaultFrom).trim();

  // Decide safe "From" header vs Reply-To to handle providers (e.g., Gmail) that refuse arbitrary From
  let headerFrom = requestedFrom;
  let replyToHeader = replyTo || undefined;

  // Determine if requestedFrom domain is allowed and compatible with the transport
  const smtpUser = process.env.SMTP_USER;
  const smtpDomain = smtpUser?.includes('@') ? smtpUser.split('@')[1].toLowerCase() : undefined;
  const reqDomain = requestedFrom.includes('@') ? requestedFrom.split('@')[1].toLowerCase() : undefined;
  const safeDomain = safeFrom.includes('@') ? safeFrom.split('@')[1].toLowerCase() : undefined;

  const domainAllowedByPolicy = !!reqDomain && (
    reqDomain === companyDomain ||
    (allowedFromDomains.length > 0 && allowedFromDomains.includes(reqDomain))
  );

  const canUseRequestedFromOnSMTP = !!smtpDomain && !!reqDomain && smtpDomain === reqDomain;
  const canUseSafeFromOnSMTP = !!smtpDomain && !!safeDomain && smtpDomain === safeDomain;

  if (requestedFrom) {
    if (domainAllowedByPolicy && canUseRequestedFromOnSMTP) {
      // ok to use as-is
    } else if (canUseSafeFromOnSMTP) {
      // Use a safe sender on the SMTP domain and keep requested as reply-to
      replyToHeader = replyToHeader || requestedFrom;
      headerFrom = safeFrom;
    } else {
      // Force company safe sender; never expose personal SMTP user (e.g. joon13...)
      replyToHeader = replyToHeader || requestedFrom;
      headerFrom = safeFrom;
    }
  }

  // Enrich display name with customer identity while keeping authenticated domain
  const customerIdentity = replyToHeader || requestedFrom;
  if (customerIdentity && headerFrom && !headerFrom.includes('<')) {
    const safeIdentity = customerIdentity.replace(/[\r\n<>]/g, '').slice(0,100);
    headerFrom = `"${safeIdentity} via Asian Shipping" <${headerFrom}>`;
  }

  console.log('[sendMail] Attempting to send email');
  console.log('[sendMail] From:', headerFrom, `(requested: ${requestedFrom})`);
  console.log('[sendMail] To:', to);
  console.log('[sendMail] Subject:', subject);
  console.log('[sendMail] Reply-To:', replyToHeader || 'none');
  console.log('[sendMail] Transport: SMTP only (Resend disabled)');

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

  console.log('[sendMail] Using SMTP transport...');
  const transporter = nodemailer.createTransport({
    host,
    port: port || 587,
    secure: port === 465, // true for 465, false for others
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({ 
      from: headerFrom, 
      replyTo: replyToHeader || headerFrom, // Default reply-to to headerFrom
      to, 
      subject, 
      text, 
      html 
    });
    console.log('[sendMail] ✅ Email sent via SMTP');
  } catch (err) {
    console.log('[sendMail] ❌ SMTP failed:', err);
    throw err;
  }
}
