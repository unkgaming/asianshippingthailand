import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    return NextResponse.json({ ok: true, inquiries });
  } catch (error) {
    console.error('Error fetching all inquiries:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch inquiries' },
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
        { ok: false, error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    // Permanently delete the inquiry from database
    await prisma.inquiry.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true, message: 'Inquiry permanently deleted' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
