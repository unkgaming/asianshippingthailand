import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper to fetch by code
async function findByCode(code: string) {
  return prisma.shipment.findUnique({ where: { code }, include: { documents: true } });
}

export async function GET(_: Request, { params }: { params: { code: string } }) {
  try {
    const shipment = await findByCode(params.code);
    if (!shipment) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, data: shipment });
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { code: string } }) {
  try {
    const body = await req.json();
    const shipment = await findByCode(params.code);
    if (!shipment) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });

    const updated = await prisma.shipment.update({
      where: { code: params.code },
      data: {
        customerName: body.customerName ?? shipment.customerName,
        customerEmail: body.customerEmail ?? shipment.customerEmail,
        origin: body.origin ?? shipment.origin,
        destination: body.destination ?? shipment.destination,
        serviceType: body.serviceType ?? shipment.serviceType,
        status: body.status ?? shipment.status,
        paymentStatus: body.paymentStatus ?? shipment.paymentStatus,
        price: body.price != null ? Number(body.price) : shipment.price,
        weight: body.weight != null ? Number(body.weight) : shipment.weight,
        packageType: body.packageType ?? shipment.packageType,
        containerContents: body.containerContents ?? shipment.containerContents,
        bookingDate: body.bookingDate ? new Date(body.bookingDate) : shipment.bookingDate,
        estimatedDelivery: body.estimatedDelivery ? new Date(body.estimatedDelivery) : shipment.estimatedDelivery,
      },
      include: { documents: true },
    });

    return NextResponse.json({ ok: true, data: updated });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: { code: string } }) {
  try {
    await prisma.shipment.delete({ where: { code: params.code } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Failed to delete' }, { status: 400 });
  }
}
