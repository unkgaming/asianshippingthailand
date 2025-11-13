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
    orderBy: { createdAt: 'desc' },
    take: Math.min(Math.max(limit, 1), 200),
  });
  return NextResponse.json({ ok: true, data: items });
}

export async function POST(req: Request) {
  try {
    const { to, subject, text, html, from } = await req.json();
    if (!to || !subject) {
      return NextResponse.json({ ok: false, error: 'to and subject are required' }, { status: 400 });
    }
    const allowed = fromOptions();
    const chosenFrom = from && allowed.includes(from) ? from : allowed[0];

    const record = await prisma.emailMessage.create({
      data: {
        direction: 'outgoing',
        from: chosenFrom,
        to: Array.isArray(to) ? to.join(',') : String(to),
        subject,
        text: text || undefined,
        html: html || undefined,
        status: 'queued',
      },
    });

    try {
      await sendMail({ from: chosenFrom, to, subject, text, html });
      await prisma.emailMessage.update({ where: { id: record.id }, data: { status: 'sent', sentAt: new Date() } });
      return NextResponse.json({ ok: true, id: record.id });
    } catch (e: any) {
      await prisma.emailMessage.update({ where: { id: record.id }, data: { status: 'failed', error: String(e?.message || e) } });
      return NextResponse.json({ ok: false, id: record.id, error: 'send-failed' }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid-json' }, { status: 400 });
  }
}
