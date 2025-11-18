import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/sendMail';

function fromOptions() {
  const raw = process.env.MAIL_FROM_OPTIONS || process.env.MAIL_FROM || 'no-reply@asianshippingthai.onresend.com';
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get('options') === '1') {
    return NextResponse.json({ ok: true, fromOptions: fromOptions() });
  }
  const limit = Number(searchParams.get('limit') || '50');
  const items = await prisma.emailMessage.findMany({
    where: { hidden: false },
    orderBy: { createdAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 200),
  });
  return NextResponse.json({ ok: true, data: items });
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'Email ID is required' },
        { status: 400 }
      );
    }

    if (action === 'hide') {
      await prisma.emailMessage.update({
        where: { id },
        data: { hidden: true },
      });
      return NextResponse.json({ ok: true, message: 'Email hidden successfully' });
    }

    return NextResponse.json(
      { ok: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update email' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { to, subject, text, html, from, replyTo, inquiryId } = await req.json();
    if (!to || !subject) {
      return NextResponse.json({ ok: false, error: 'to and subject are required' }, { status: 400 });
    }
    
    // If custom from is provided, use it; otherwise use system default
    const actualFrom = from || fromOptions()[0];

    const record = await prisma.emailMessage.create({
      data: {
        direction: 'outgoing',
        from: actualFrom, // Store the actual sender email
        to: Array.isArray(to) ? to.join(',') : String(to),
        subject,
        text: text || undefined,
        html: html || undefined,
        status: 'queued',
      },
    });

    try {
      // Send email from the specified address (customer's email)
      await sendMail({ 
        from: actualFrom,  // Customer's email or system email
        replyTo: replyTo,  // Optional reply-to override
        to, 
        subject, 
        text, 
        html 
      });
      await prisma.emailMessage.update({ where: { id: record.id }, data: { status: 'sent', sentAt: new Date() } });
      
      // If inquiryId is provided, mark that specific inquiry as replied
      if (inquiryId) {
        await prisma.inquiry.update({
          where: { id: inquiryId },
          data: { status: 'replied' }
        }).catch(() => {
          // Inquiry might not exist, that's okay
        });
      }
      
      return NextResponse.json({ ok: true, id: record.id });
    } catch (e: any) {
      await prisma.emailMessage.update({ where: { id: record.id }, data: { status: 'failed', error: String(e?.message || e) } });
      return NextResponse.json({ ok: false, id: record.id, error: 'send-failed' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }
}
