import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cacheService } from '@/lib/cache';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'employee') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || '30'; // days

    // Check cache
    const cacheKey = `analytics:${range}`;
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ok: true, data: cached, cached: true });
    }

    const daysAgo = parseInt(range);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Revenue analytics
    const shipments = await prisma.shipment.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        price: true,
        paymentStatus: true,
        status: true,
        serviceType: true,
        createdAt: true,
      },
    });

    const totalRevenue = shipments
      .filter(s => s.paymentStatus === 'Paid')
      .reduce((sum, s) => sum + s.price, 0);

    const pendingRevenue = shipments
      .filter(s => s.paymentStatus === 'Pending')
      .reduce((sum, s) => sum + s.price, 0);

    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    shipments.forEach(s => {
      statusBreakdown[s.status] = (statusBreakdown[s.status] || 0) + 1;
    });

    // Service type breakdown
    const serviceBreakdown: Record<string, number> = {};
    shipments.forEach(s => {
      serviceBreakdown[s.serviceType] = (serviceBreakdown[s.serviceType] || 0) + 1;
    });

    // Daily revenue trend
    const revenueByDay: Record<string, number> = {};
    shipments
      .filter(s => s.paymentStatus === 'Paid')
      .forEach(s => {
        const date = s.createdAt.toISOString().split('T')[0];
        revenueByDay[date] = (revenueByDay[date] || 0) + s.price;
      });

    // Inquiries
    const inquiries = await prisma.inquiry.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        status: true,
        createdAt: true,
      },
    });

    const inquiryStatus: Record<string, number> = {};
    inquiries.forEach(i => {
      inquiryStatus[i.status] = (inquiryStatus[i.status] || 0) + 1;
    });

    const analytics = {
      overview: {
        totalShipments: shipments.length,
        totalRevenue,
        pendingRevenue,
        averageShipmentValue: shipments.length > 0 ? totalRevenue / shipments.length : 0,
        totalInquiries: inquiries.length,
      },
      statusBreakdown,
      serviceBreakdown,
      revenueByDay,
      inquiryStatus,
      period: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days: daysAgo,
      },
    };

    // Cache for 5 minutes
    cacheService.set(cacheKey, analytics, 300000);

    return NextResponse.json({ ok: true, data: analytics });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
