import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// List and create shipments
export async function GET() {
  try {
    const shipments = await prisma.shipment.findMany({
      include: { documents: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ ok: true, data: shipments });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch shipments' }, { status: 500 });
  }
}

function generateCode() {
  const now = new Date();
  const year = now.getFullYear();
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRK-${year}-${rand}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      code,
      customerName,
      customerEmail,
      origin,
      destination,
      serviceType,
      status = 'Pending Pickup',
      paymentStatus = 'Pending',
      price = 0,
      weight = 0,
      packageType = 'Cartons',
      containerContents = '',
      bookingDate,
      estimatedDelivery,
    } = body || {};

    if (!customerName || !customerEmail || !origin || !destination || !serviceType || !bookingDate) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const created = await prisma.shipment.create({
      data: {
        code: code || generateCode(),
        customerName,
        customerEmail,
        origin,
        destination,
        serviceType,
        status,
        paymentStatus,
        price: Number(price) || 0,
        weight: Number(weight) || 0,
        packageType,
        containerContents,
        bookingDate: new Date(bookingDate),
        estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : null,
      },
      include: { documents: true },
    });

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
