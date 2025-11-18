import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const results: any = { ok: true, tests: [] };
  
  try {
    // Test 1: Create a test inquiry
    const testInquiry = await prisma.inquiry.create({
      data: {
        name: 'Diagnostic Test User',
        email: 'diagnostic@test.com',
        phone: '000-0000',
        company: 'Test Co',
        service: 'airfreight',
        productType: 'Test Product',
        weight: 10,
        weightUnit: 'kg',
        message: 'Automated diagnostic test',
        status: 'new',
      },
    });
    results.tests.push({
      test: 'Create Inquiry',
      status: 'SUCCESS',
      id: testInquiry.id,
    });
    
    // Test 2: Create a test email message (incoming)
    const testEmail = await prisma.emailMessage.create({
      data: {
        direction: 'incoming',
        from: 'diagnostic@test.com',
        to: 'support@asianshippingthai.com',
        subject: 'Diagnostic Test',
        text: 'Test message',
        html: '<p>Test</p>',
        status: 'received',
        sentAt: new Date(),
      },
    });
    results.tests.push({
      test: 'Create Email Message',
      status: 'SUCCESS',
      id: testEmail.id,
    });
    
    // Test 3: Query all inquiries
    const allInquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    results.tests.push({
      test: 'Query Inquiries',
      status: 'SUCCESS',
      count: allInquiries.length,
      sample: allInquiries.slice(0, 3).map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        service: i.service,
        status: i.status,
        createdAt: i.createdAt,
      })),
    });
    
    // Test 4: Query all email messages
    const allEmails = await prisma.emailMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    results.tests.push({
      test: 'Query Email Messages',
      status: 'SUCCESS',
      count: allEmails.length,
      sample: allEmails.slice(0, 3).map(e => ({
        id: e.id,
        direction: e.direction,
        from: e.from,
        to: e.to,
        status: e.status,
        createdAt: e.createdAt,
      })),
    });
    
    // Test 5: Check staff user
    const staffUser = await prisma.user.findUnique({
      where: { email: '67011602@kmitl.ac.th' },
    });
    results.tests.push({
      test: 'Check Staff User Role',
      status: 'SUCCESS',
      user: staffUser ? {
        email: staffUser.email,
        name: staffUser.name,
        role: staffUser.role,
      } : null,
    });
    
    return NextResponse.json(results);
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e.message,
      stack: e.stack,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to run diagnostics',
    endpoint: '/api/diagnostic',
  });
}
