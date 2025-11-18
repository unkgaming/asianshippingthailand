import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const results: any = { tests: [] };
  
  // Test 1: Query inquiries
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    results.tests.push({
      name: 'Query Inquiries',
      status: 'success',
      count: inquiries.length,
      data: inquiries.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        service: i.service,
        createdAt: i.createdAt,
      })),
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Query Inquiries',
      status: 'error',
      error: e.message,
    });
  }
  
  // Test 2: Query email messages
  try {
    const emails = await prisma.emailMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    results.tests.push({
      name: 'Query Emails',
      status: 'success',
      count: emails.length,
      data: emails.map(e => ({
        id: e.id,
        direction: e.direction,
        from: e.from,
        to: e.to,
        subject: e.subject,
        status: e.status,
        createdAt: e.createdAt,
      })),
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Query Emails',
      status: 'error',
      error: e.message,
    });
  }
  
  // Test 3: Check user role
  try {
    const user = await prisma.user.findUnique({
      where: { email: '67011602@kmitl.ac.th' },
    });
    results.tests.push({
      name: 'Check Staff User',
      status: 'success',
      data: user ? {
        email: user.email,
        name: user.name,
        role: user.role,
      } : null,
    });
  } catch (e: any) {
    results.tests.push({
      name: 'Check Staff User',
      status: 'error',
      error: e.message,
    });
  }
  
  return NextResponse.json(results);
}
