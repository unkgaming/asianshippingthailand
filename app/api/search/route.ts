import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { cacheService } from '@/lib/cache';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const status = searchParams.get('status');
    const serviceType = searchParams.get('serviceType');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const paymentStatus = searchParams.get('paymentStatus');

    // Build where clause
    const where: any = {};

    // Non-staff can only see their own shipments
    if ((session.user as any).role !== 'employee') {
      where.customerEmail = session.user.email;
    }

    // Text search across multiple fields
    if (query) {
      where.OR = [
        { code: { contains: query, mode: 'insensitive' } },
        { customerName: { contains: query, mode: 'insensitive' } },
        { customerEmail: { contains: query, mode: 'insensitive' } },
        { origin: { contains: query, mode: 'insensitive' } },
        { destination: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Filters
    if (status) where.status = status;
    if (serviceType) where.serviceType = serviceType;
    if (paymentStatus) where.paymentStatus = paymentStatus;

    // Date range
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const shipments = await prisma.shipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit results
      include: { documents: true },
    });

    return NextResponse.json({ ok: true, data: shipments, count: shipments.length });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}
