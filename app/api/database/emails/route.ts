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
