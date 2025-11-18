import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Fetch tracking updates for a shipment
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const shipmentId = searchParams.get('shipmentId');

    console.log('[Tracking API GET] Requested shipmentId:', shipmentId);

    if (!shipmentId) {
      return NextResponse.json(
        { error: 'shipmentId is required' },
        { status: 400 }
      );
    }

    const trackingUpdates = await prisma.trackingUpdate.findMany({
      where: { shipmentId },
      orderBy: { createdAt: 'desc' },
    });

    console.log('[Tracking API GET] Found', trackingUpdates.length, 'updates for shipmentId:', shipmentId);

    return NextResponse.json(trackingUpdates);
  } catch (error) {
    console.error('[Tracking API GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tracking updates' },
      { status: 500 }
    );
  }
}

// POST: Add new tracking update (marks previous as inactive)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { shipmentId, status, location, description } = await req.json();

    if (!shipmentId || !status) {
      return NextResponse.json(
        { error: 'shipmentId and status are required' },
        { status: 400 }
      );
    }

    // Mark all existing tracking updates for this shipment as inactive
    await prisma.trackingUpdate.updateMany({
      where: { shipmentId, isActive: true },
      data: { isActive: false },
    });

    // Create new tracking update (active by default)
    const trackingUpdate = await prisma.trackingUpdate.create({
      data: {
        shipmentId,
        status,
        location: location || null,
        description: description || null,
        isActive: true,
        createdBy: session.user.email,
      },
    });

    console.log('[Tracking API POST] Created tracking update:', trackingUpdate.id);

    return NextResponse.json(trackingUpdate);
  } catch (error) {
    console.error('[Tracking API POST] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create tracking update' },
      { status: 500 }
    );
  }
}

// DELETE: Remove a tracking update
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'id is required' },
        { status: 400 }
      );
    }

    await prisma.trackingUpdate.delete({
      where: { id },
    });

    console.log('[Tracking API DELETE] Deleted tracking update:', id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Tracking API DELETE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete tracking update' },
      { status: 500 }
    );
  }
}
