import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // Basic shape validation
    const {
      name,
      email,
      phone,
      company,
      service,
      productType,
      weight,
      weightUnit,
      message,
    } = data || {};

    if (!name || !email || !service || !message) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Optionally validate weight
    if (weight) {
      const w = parseFloat(weight);
      if (isNaN(w) || w <= 0) {
        return NextResponse.json({ ok: false, error: 'Invalid weight' }, { status: 400 });
      }
    }

    // In real app: send email, push to CRM, or persist
    // eslint-disable-next-line no-console
    console.log('[CONTACT] New inquiry', {
      name,
      email,
      phone,
      company,
      service,
      productType,
      weight,
      weightUnit,
      message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
}
