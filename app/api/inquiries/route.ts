import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cacheService, cacheKeys } from '@/lib/cache';
import { rateLimitMiddleware } from '@/lib/ratelimit';

export async function GET(req: Request) {
  try {
    // Rate limiting
    const rateLimit = await rateLimitMiddleware(req as any, 'apiRead');
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Too many requests' },
        { status: 429, headers: rateLimit.headers }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const includeReplied = searchParams.get('includeReplied') === 'true';
    
    // Check cache
    const cacheKey = cacheKeys.inquiries(limit);
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return NextResponse.json({ ok: true, inquiries: cached, cached: true }, { headers: rateLimit.headers });
    }

    const inquiries = await prisma.inquiry.findMany({
      where: includeReplied ? { hidden: false } : { status: 'new', hidden: false },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Cache for 30 seconds (frequently changing data)
    cacheService.set(cacheKey, inquiries, 30000);

    return NextResponse.json({ ok: true, inquiries }, { headers: rateLimit.headers });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch inquiries' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'Inquiry ID is required' },
        { status: 400 }
      );
    }

    if (action === 'hide') {
      // Hide the inquiry (soft delete)
      await prisma.inquiry.update({
        where: { id },
        data: { hidden: true },
      });

      // Clear cache
      cacheService.clear();

      return NextResponse.json({ ok: true, message: 'Inquiry hidden successfully' });
    }

    return NextResponse.json(
      { ok: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}
