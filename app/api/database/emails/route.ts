import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const emails = await prisma.emailMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    return NextResponse.json({ ok: true, data: emails });
  } catch (error) {
    console.error('Error fetching all emails:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null) as any;
    if (!body) {
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const to = String(body.to || '').trim();
    const subject = String(body.subject || '').trim();
    const from = (body.from ? String(body.from) : '').trim();
    const text = body.text ? String(body.text) : null;
    const html = body.html ? String(body.html) : null;
    const direction = body.direction && typeof body.direction === 'string' ? body.direction : 'outgoing';
    const status = body.status && typeof body.status === 'string' ? body.status : 'sent';

    if (!to || !subject) {
      return NextResponse.json(
        { ok: false, error: 'Both to and subject are required' },
        { status: 400 }
      );
    }

    const created = await prisma.emailMessage.create({
      data: {
        to,
        from: from || 'info@asianshippingthai.com',
        subject,
        text,
        html,
        direction,
        status,
        sentAt: status === 'sent' ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating email record:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create email record' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'Email ID is required' },
        { status: 400 }
      );
    }

    // Permanently delete the email from database
    await prisma.emailMessage.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, message: 'Email permanently deleted' });
  } catch (error) {
    console.error('Error deleting email:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete email' },
      { status: 500 }
    );
  }
}
