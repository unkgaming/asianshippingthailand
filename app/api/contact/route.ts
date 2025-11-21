import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/sendMail';
import { rateLimitMiddleware } from '@/lib/ratelimit';
import { cacheService } from '@/lib/cache';

export async function POST(req: Request) {
  try {
    // Rate limiting: 5 submissions per minute per IP
    const rateLimit = await rateLimitMiddleware(req as any, 'contact');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests. Please try again later.' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const data = await req.json();
    console.log('[Contact API] Received submission:', { name: data.name, email: data.email, service: data.service });
    
    // Basic shape validation
    const {
      name,
      email,
      phone,
      company,
      service,
      sendTo,
      productType,
      weight,
      weightUnit,
      message,
    } = data || {};

    if (!name || !email || !service || !message) {
      console.error('[Contact API] Missing required fields');
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Optionally validate weight
    if (weight) {
      const w = parseFloat(weight);
      if (isNaN(w) || w <= 0) {
        return NextResponse.json({ ok: false, error: 'Invalid weight' }, { status: 400 });
      }
    }

    // Persist inquiry
    const created = await prisma.inquiry.create({
      data: {
        name,
        email,
        phone,
        company,
        service,
        productType,
        weight: weight ? Number(weight) : null,
        weightUnit,
        message,
      },
    });
    console.log('[Contact API] Inquiry created:', created.id);

    // Invalidate inquiry cache so staff see new inquiry immediately
    cacheService.invalidateInquiries();

    // Decide recipient routing:
    // 1. Explicit sendTo from client (validated later) overrides.
    // 2. If service indicates general info -> info@, else main -> asian@
    // 3. Fallback to MAIL_TO env.
    const generalKeywords = ['general', 'info', 'information'];
    const normalizedService = (service || '').toLowerCase();
    const infoAddress = process.env.CONTACT_INFO_TO || 'info@asianshippingthai.com';
    const mainAddress = process.env.CONTACT_MAIN_TO || 'asian@asianshippingthai.com';
    let recipient = sendTo || undefined;
    if (!recipient) {
      if (generalKeywords.some(k => normalizedService.includes(k))) {
        recipient = infoAddress;
      } else {
        recipient = mainAddress;
      }
    }
    // Final fallback if still unset
    recipient = recipient || process.env.MAIL_TO || mainAddress;
    
    const subject = `New inquiry from ${name} (${service || 'General'})`;
    const text = `New inquiry received\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nCompany: ${company || '-'}\nService: ${service || '-'}\nProduct Type: ${productType || '-'}\nWeight: ${weight ? `${weight} ${weightUnit || ''}` : '-'}\n\nMessage:\n${message}\n\nSubmitted at: ${new Date().toISOString()}`;
    const html = `<p><strong>New inquiry received</strong></p>
             <ul>
               <li><b>Name:</b> ${name}</li>
               <li><b>Email:</b> ${email}</li>
               <li><b>Phone:</b> ${phone || '-'}</li>
               <li><b>Company:</b> ${company || '-'}</li>
               <li><b>Service:</b> ${service || '-'}</li>
               <li><b>Product Type:</b> ${productType || '-'}</li>
               <li><b>Weight:</b> ${weight ? `${weight} ${weightUnit || ''}` : '-'}</li>
             </ul>
             <p><b>Message:</b></p>
             <pre style="white-space:pre-wrap">${message}</pre>
             <p>Submitted at: ${new Date().toISOString()}</p>`;

    // Send notification email with customer as reply-to
    void sendMail({
      from: process.env.EMAIL_FROM_WEBFORM || 'webform@asianshippingthai.com',
      replyTo: email, // Replies go directly to customer
      to: recipient,
      subject,
      text,
      html,
    }).catch(() => {});

    // Log as an incoming email for staff visibility in Admin -> Recent Emails
    try {
      const emailRecord = await prisma.emailMessage.create({
        data: {
          direction: 'incoming',
          from: email,
          to: recipient || 'support@asianshippingthai.com',
          subject,
          text,
          html,
          status: 'received',
          sentAt: new Date(),
        },
      });
      console.log('[Contact API] Email message logged:', emailRecord.id);
    } catch (e: any) {
      console.error('[Contact API] Failed to log email message:', e.message);
      // Non-fatal if logging fails
    }

    console.log('[Contact API] Success! Inquiry and email logged.');
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e: any) {
    console.error('[Contact API Error]', e);
    return NextResponse.json({ ok: false, error: e?.message || 'Invalid request' }, { status: 400 });
  }
}
