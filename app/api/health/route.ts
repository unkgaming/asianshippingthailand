import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cacheService } from '@/lib/cache';

export async function GET() {
  try {
    // Check database connection
    const startDb = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startDb;

    // Get cache stats
    const cacheStats = cacheService.getStats();

    // Calculate uptime
    const uptime = process.uptime();

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'connected',
          latency: `${dbLatency}ms`,
        },
        cache: {
          status: 'active',
          size: cacheStats.size,
          max: cacheStats.max,
          usage: `${((cacheStats.size / cacheStats.max) * 100).toFixed(1)}%`,
        },
        application: {
          status: 'running',
          uptime: `${Math.floor(uptime)}s`,
          memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
          },
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
