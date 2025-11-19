import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

// Create payment intent for shipment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { shipmentId, returnUrl } = await req.json();

    // Get shipment details
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    // Check if user owns this shipment
    if (shipment.customerEmail !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if already paid
    if (shipment.paymentStatus === 'Paid') {
      return NextResponse.json({ error: 'Already paid' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Shipment ${shipment.code}`,
              description: `${shipment.origin} → ${shipment.destination} (${shipment.serviceType})`,
            },
            unit_amount: Math.round(shipment.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: {
        shipmentId: shipment.id,
        shipmentCode: shipment.code,
      },
      customer_email: shipment.customerEmail,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment' },
      { status: 500 }
    );
  }
}

// Verify payment after completion
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update shipment payment status
      const shipmentId = session.metadata?.shipmentId;
      if (shipmentId) {
        await prisma.shipment.update({
          where: { id: shipmentId },
          data: { paymentStatus: 'Paid' },
        });
      }

      return NextResponse.json({
        status: 'paid',
        amount: session.amount_total,
        currency: session.currency,
      });
    }

    return NextResponse.json({ status: session.payment_status });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
