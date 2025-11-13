// app/api/track/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get('number') || 'UNKNOWN';

  // fake events
  const events = [
    { time: '2025-11-09 10:12', location: 'Bangkok - Warehouse', desc: 'Received at origin warehouse' },
    { time: '2025-11-10 02:30', location: 'Bangkok - In Transit', desc: 'In transit to destination country' },
    { time: '2025-11-11 08:45', location: 'Customs Clearance', desc: 'Cleared customs' }
  ];

  const payload = {
    number,
    status: 'In Transit',
    eta: '2025-11-15',
    events
  };

  return NextResponse.json(payload);
}
