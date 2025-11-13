import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/sendMail';

export async function POST(req: Request) {
  try {
    const data = await req.json();
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

    // Try to notify via email (best-effort, non-blocking)
    // Use sendTo if provided, otherwise fall back to MAIL_TO env var
    const recipient = sendTo || process.env.MAIL_TO;
    
    void sendMail({
      to: recipient,
      subject: `New inquiry from ${name} (${service || 'General'})`,
      text: `New inquiry received\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nCompany: ${company || '-'}\nService: ${service || '-'}\nProduct Type: ${productType || '-'}\nWeight: ${weight ? `${weight} ${weightUnit || ''}` : '-'}\n\nMessage:\n${message}\n\nSubmitted at: ${new Date().toISOString()}`,
      html: `<p><strong>New inquiry received</strong></p>
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
             <p>Submitted at: ${new Date().toISOString()}</p>`,
    }).catch(() => {});

    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
