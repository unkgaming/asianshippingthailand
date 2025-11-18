import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { cacheService, cacheKeys } from '@/lib/cache';
import { rateLimitMiddleware } from '@/lib/ratelimit';
import { optimisticUpdate } from '@/lib/transaction';
import { createAuditLog, getClientInfo } from '@/lib/audit';
import { sendShipmentStatusNotification } from '@/lib/notifications';

// List and create shipments
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const customerEmail = searchParams.get("customerEmail");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");
    const search = searchParams.get("search");

    const where: any = {};

    // Customer portal: filter by logged-in user's email
    if (session?.user && session.user.role !== "employee" && customerEmail) {
      where.customerEmail = customerEmail;
    }

    // Filters
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
      ];
    }

    const shipments = await prisma.shipment.findMany({
      where,
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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

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

    // Create initial tracking update
    console.log('[Shipment API] Creating tracking update for shipment ID:', created.id);
    await prisma.trackingUpdate.create({
      data: {
        shipmentId: created.id,
        status: 'Shipment Created',
        location: origin,
        description: `Shipment booked for ${serviceType} service from ${origin} to ${destination}`,
        isActive: true,
        createdBy: session.user.email || 'system',
      },
    }).then(tracking => {
      console.log('[Shipment API] ✅ Tracking update created:', tracking.id);
    }).catch(err => {
      console.error('[Shipment API] ❌ Failed to create initial tracking update:', err);
      // Don't fail the shipment creation if tracking fails
    });

    // Audit log
    const clientInfo = getClientInfo(req);
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email!,
      action: 'CREATE',
      entityType: 'Shipment',
      entityId: created.id,
      details: { code: created.code, status: created.status },
      ...clientInfo,
    });

    return NextResponse.json({ ok: true, data: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status, paymentStatus, price, version } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Shipment ID required' }, { status: 400 });
    }

    // Rate limiting
    const rateLimit = await rateLimitMiddleware(req as any, 'apiWrite', session.user.email!);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const updateData: any = {};
    const oldShipment = await prisma.shipment.findUnique({ where: { id } });
    if (!oldShipment) {
      return NextResponse.json({ ok: false, error: 'Shipment not found' }, { status: 404 });
    }

    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (price !== undefined) updateData.price = parseFloat(price);

    try {
      // Use optimistic locking helper
      const shipment = version !== undefined
        ? await optimisticUpdate('shipment', id, version, updateData)
        : await prisma.shipment.update({
            where: { id },
            data: { ...updateData, version: { increment: 1 } },
          });

      // Invalidate cache
      cacheService.invalidateShipment(id, shipment.code, shipment.customerEmail);
      cacheService.delete('shipments:all');

      // Audit log
      const clientInfo = getClientInfo(req);
      await createAuditLog({
        userId: session.user.id,
        userEmail: session.user.email!,
        action: 'UPDATE',
        entityType: 'Shipment',
        entityId: shipment.id,
        details: { 
          code: shipment.code,
          changes: updateData,
          oldStatus: oldShipment.status,
          newStatus: shipment.status,
        },
        ...clientInfo,
      });

      // Send notification if status changed
      if (status && status !== oldShipment.status) {
        await sendShipmentStatusNotification({
          code: shipment.code,
          customerName: shipment.customerName,
          customerEmail: shipment.customerEmail,
          status: shipment.status,
          origin: shipment.origin,
          destination: shipment.destination,
          estimatedDelivery: shipment.estimatedDelivery,
        }).catch(err => console.error('Failed to send notification:', err));
      }

      return NextResponse.json({ ok: true, data: shipment }, { headers: rateLimit.headers });
    } catch (error: any) {
      if (error.message.includes('Conflict')) {
        return NextResponse.json({ 
          ok: false, 
          error: 'Shipment was modified by another user. Please refresh and try again.',
          code: 'CONFLICT'
        }, { status: 409, headers: rateLimit.headers });
      }
      throw error;
    }
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'employee') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Shipment ID required' }, { status: 400 });
    }

    const shipment = await prisma.shipment.findUnique({ where: { id } });
    if (!shipment) {
      return NextResponse.json({ ok: false, error: 'Shipment not found' }, { status: 404 });
    }

    await prisma.shipment.delete({ where: { id } });

    // Audit log
    const clientInfo = getClientInfo(req);
    await createAuditLog({
      userId: session.user.id,
      userEmail: session.user.email!,
      action: 'DELETE',
      entityType: 'Shipment',
      entityId: id,
      details: { code: shipment.code },
      ...clientInfo,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message || 'Failed to delete' }, { status: 500 });
  }
}
