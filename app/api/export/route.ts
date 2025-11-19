import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Parser } from 'json2csv';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'shipments';
    const format = searchParams.get('format') || 'csv';

    let data: any[] = [];
    let fields: string[] = [];

    if (type === 'shipments') {
      // Check if user is staff or requesting their own shipments
      const isStaff = (session.user as any).role === 'employee';
      
      data = await prisma.shipment.findMany({
        where: isStaff ? {} : { customerEmail: session.user.email! },
        orderBy: { createdAt: 'desc' },
      });

      fields = [
        'code',
        'customerName',
        'customerEmail',
        'origin',
        'destination',
        'serviceType',
        'status',
        'paymentStatus',
        'price',
        'weight',
        'packageType',
        'bookingDate',
        'estimatedDelivery',
      ];
    } else if (type === 'inquiries') {
      // Staff only
      if ((session.user as any).role !== 'employee') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      data = await prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
      });

      fields = [
        'name',
        'email',
        'phone',
        'company',
        'service',
        'productType',
        'weight',
        'status',
        'createdAt',
      ];
    }

    // Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${type}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export data' },
      { status: 500 }
    );
  }
}
